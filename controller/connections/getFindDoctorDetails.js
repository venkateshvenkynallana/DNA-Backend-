
import { decrypt } from "../../lib/encrypt.js";
import { decodeToken } from "../../lib/utils.js";
import User from "../../models/User.js";
import Connections from "../../models/Connection.js";


export const getFindDoctorDetails = async(req, res)=>{
    try {
            const {userId} = decodeToken(req);
             const connections = await Connections.find({
                $or: [
                    { sender: userId },
                    { receiver: userId }
                ]
                });
                const connectionMap = {};
                connections.forEach((conn) => {
                let otherUserId;
                if (conn.sender.toString() === userId) {
                    otherUserId = conn.receiver.toString();
                } else {
                    otherUserId = conn.sender.toString();
                }
                connectionMap[otherUserId] = conn.status;
                });
            const users = await User.find(
                {_id: {$ne: userId}}
            ).select("-password");
            const decryptedData = users.map((user) => {
                const status = connectionMap[user._id.toString()] || null;
                return {
                    fullName:user?.fullName,
                    designation:(user?.designation)?decrypt(user.designation):null,
                    profilepic: user?.profilepic,
                    connectionStatus: status,
                    _id: user?._id,
                };  
            });
            console.log("decryptedData",decryptedData)
            res.status(200).json({
                success: true,
                usersList: decryptedData
            });
        } catch (error) {
            console.log("get users in user dashboard error", error);
            res.status(500).json({ message: "Internal server error" });
        }
}