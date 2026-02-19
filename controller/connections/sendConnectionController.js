import resendSetup from "../../lib/mailer.js";
import { decodeToken } from "../../lib/utils.js";
import Connections from "../../models/Connection.js";
import User from "../../models/User.js";

export const sendConnectionRequest = async (req, res) => {
    try {

        const { userId } = await decodeToken(req);
        const senderId = userId;
        const { receiverId } = req.body;

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

        const newConnection = await Connections.create({
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
           
        });


        // const sendRequest = await resendSetup.emails?.send({
        //     from: "dna-support@dna.hi9.in",
        //     to: receiverUser.email,
        //     subject: "New Connection Request",
        //     html: `
        //         <h2>Hello ${receiverUser.firstName}</h2>
        //         <p>You have received a new connection request from <b>${senderUser.fullName}</b>.</p>
        //         <p>Login to your account to accept or reject the request.</p>
        //         <br/>
        //         <p>Regards,<br/>Your App Team</p>
        //         `
        // })
        res.status(201).json({ message: "Connection request sent successfully.", connection: newConnection });

    } catch (error) {
        console.error("Error sending connection request:", error);
        res.status(500).json({ message: "Internal Server Error. could not send connection request."});
    }
}