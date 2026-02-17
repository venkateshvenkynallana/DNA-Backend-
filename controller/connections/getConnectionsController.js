import Connections from "../../models/Connection.js";


export const getConnectionsController = async (req, res) => {
    try {
        const  userId  = req.userId;
        console.log("User ID from token:", userId);

        const getConnections = await Connections.find({
            status: "accepted",
            $or: [
                { sender: userId },
                { receiver: userId }
            ]
        })
        .populate("sender", "fullName profilePic designation")
        .populate("receiver", "fullName profilePic designation");

        res.status(200).json({ 
            count: getConnections.length,
            getConnections
        })
    } catch (error) {
        console.log("Error fetching connections:", error);
        res.status(500).json({ message :"Internal Server Error... "});
    }
}