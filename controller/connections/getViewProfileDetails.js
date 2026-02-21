import mongoose from "mongoose";
import { decrypt } from "../../lib/encrypt.js";
import { decodeToken } from "../../lib/utils.js";
import Connections from "../../models/Connection.js";
import User from "../../models/User.js";


export const getViewProfileDetails = async(req, res)=>{
    try {
        const decoded = decodeToken(req);
        const loggedInUserId = decoded.userId;

        const { userId }= req.params
        console.log("loggedInUserId",loggedInUserId);
        console.log("loggedInUserId",userId);
        if(!mongoose.Types.ObjectId.isValid(userId)){
            return res.status(400).json({ message: "Invalid User ID" });
        }

        const connection = await Connections.findOne({
            $or: [
                { sender: loggedInUserId, receiver: userId },
                { sender: userId, receiver: loggedInUserId }
            ]
        });
        const connectionStatus = connection ? connection.status : null;

        const user= await User.findById(userId).select("-password -resetOtp -otpExpire");

        if(!user){
            return res.status(404).json({message: "User not found in view profile..!"})
        }

        if(connection && connection.status === "accepted"){
            const userObj = user.toObject();
            return res.status(200).json({
                success: true,
                connectionStatus,
                data:{
                    ...userObj,
                    designation:(userObj?.designation)?decrypt(userObj.designation):null,
                    email: userObj.email ? decrypt(userObj.email) : null,
                    phoneNo: userObj.phoneNo ? decrypt(userObj.phoneNo) : null,
                }
            })
        }

        return res.status(200).json({
            access:"limited",
            connectionStatus,
            data:{
                _id: user._id,
                fullName: user?.fullName,
                profilepic: user?.profilepic,
                designation: user?.designation ? decrypt(user.designation) : null
            }
        })
    } catch (error) {
        console.log("Error fetching view profile details:", error);
        res.status(500).json({ message :"Internal Server Error... !"});
    }
}