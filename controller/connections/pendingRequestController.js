import { decrypt } from "../../lib/encrypt.js";
import Connections from "../../models/Connection.js";

export const getPendingRequestsController = async (req, res) => {
    try {
        const userId = req.userId;

        const pendingRequest = await Connections.find({
            status: "pending",
            $or: [
                { sender: userId },
                { receiver: userId }
            ]
        })
        

        const pendingRequests = pendingRequest.map((user)=>{
            return{
                ...user.toObject(),
                receiverDesignation: decrypt(user.receiverDesignation),
                senderDesignation: decrypt(user.senderDesignation)
            }
        })
        res.status(200).json({
            success: true,
            data: pendingRequests,
        });

    } catch (err) {
        console.log("Error fetching pending connection requests:", err);
        res.status(500).json({ message: "Internal Server Error" });
    }
}