import { decrypt } from "../../lib/encrypt.js";
import Connections from "../../models/Connection.js";


export const getConnectionsController = async (req, res) => {
    try {
        const  userId  = req.userId;
        console.log("User ID from token:", userId);

        const getConnection = await Connections.find({
            status: "accepted",
            $or: [
                { sender: userId },
                { receiver: userId }
            ]
        })
        .populate("sender", "fullName profilePic designation senderDesignation")
        .populate("receiver", "fullName profilePic designation");

        const getConnections = getConnection.map((user)=>{
            return{
                ...user.toObject(),
                senderDesignation: decrypt(user.senderDesignation),
                receiverDesignation: decrypt(user.receiverDesignation),
            }
        })

        res.status(200).json({ 
            count: getConnections.length,
            getConnections
        })
    } catch (error) {
        console.log("Error fetching connections:", error);
        res.status(500).json({ message :"Internal Server Error... "});
    }
}