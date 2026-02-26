import { decrypt } from "../../lib/encrypt.js";
import mongoose from "mongoose";
import resendSetup from "../../lib/mailer.js";
import { getIO, onlineUsers } from "../../lib/socket.js";
import { decodeToken } from "../../lib/utils.js";
import Connections from "../../models/Connection.js";
import { Notification } from "../../models/notifications.js";
import User from "../../models/User.js";

export const sendConnectionRequest = async (req, res) => {
    try {

        const { userId } = await decodeToken(req);
        const senderId = userId;
        const { receiverId } = req.body;

        const session=await mongoose.startSession()

        if(senderId === receiverId) {
            return res.status(400).json({ message: "You cannot send a connection request to yourself." });
        }

        const senderUser = await User.findById(senderId);
        const receiverUser = await User.findById(receiverId);

        if(!senderUser || !receiverUser) {
            return res.status(404).json({ message: "Sender or receiver user not found." });
        }


        const existingConnection = await Connections.findOne({
            $or: [
                { sender: senderId, receiver: receiverId },
                { sender: receiverId, receiver: senderId }
            ]
        });

        if(existingConnection) {
            return res.status(400).json({ message: "Connection request already sent." });
        }

        const newConnection = await Connections.insertOne({
             _id: `${senderId}_._${receiverId}`,
            sender: senderId,
            senderFullName: senderUser.fullName,
            senderProfilePic: senderUser.profilepic,
            senderDesignation: senderUser.designation,

            receiver: receiverId,
            receiverFullName: receiverUser.fullName,
            receiverProfilePic: receiverUser.profilepic,
            receiverDesignation: receiverUser.designation,

            status: "pending"

        },{session});


        await resendSetup().emails?.send({
            from: "dna-support@dna.hi9.in",
            to: decrypt(receiverUser.email),
            subject: "New Connection Request",
            html: `
                <div style="font-family: Arial, Helvetica, sans-serif; background-color: #f4f6f8; padding: 30px;">    
                <div style="max-width: 600px; margin: auto; background: #ffffff; padding: 30px; border-radius: 8px; box-shadow: 0 4px 10px rgba(0,0,0,0.05);">
                    <h2 style="color: #222222; margin-bottom: 20px;">
                        Hello ${receiverUser.fullName},
                    </h2>
                    <p style="font-size: 15px; color: #555555; line-height: 1.6;">
                        You have received a new connection request from 
                        <span style="font-weight: bold; color: #000000;">
                            ${senderUser.fullName}
                        </span>.
                    </p>
                    <p style="font-size: 15px; color: #555555; line-height: 1.6;">
                        Please log in to your account to accept or reject the request.
                    </p>
                    <div style="text-align: center; margin: 35px 0;">
                        <a href="https://dna-frontend-eosin.vercel.app/landing?isLogin=true" 
                        style="
                                background-color: #4CAF50;
                                color: #ffffff;
                                padding: 14px 30px;
                                text-decoration: none;
                                border-radius: 6px;
                                font-size: 15px;
                                font-weight: bold;
                                display: inline-block;
                        ">
                            Login to Your Account
                        </a>
                    </div>
                    <hr style="border: none; border-top: 1px solid #eeeeee; margin: 30px 0;" />
                    <p style="font-size: 13px; color: #888888;">
                        If you did not expect this request, you can safely ignore this email.
                    </p>
                    <p style="font-size: 14px; color: #444444; margin-top: 20px;">
                        Regards,<br/>
                        <strong>DNA Support Team</strong>
                    </p>
                </div>
            </div>
                `
        })
        res.status(201).json({ message: "Connection request sent successfully.", connection: newConnection });

    } catch (error) {
        console.error("Error sending connection request:", error);
        res.status(500).json({ message: "Internal Server Error. could not send connection request." });
    }
}