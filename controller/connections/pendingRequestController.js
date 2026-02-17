import Connections from "../../models/Connection.js";

export const getPendingRequestsController = async (req, res) => {
    try {
        const userId = req.userId;

        const pendingRequests = await Connections.find({
            status: "pending",
            $or: [
                { sender: userId },
                { receiver: userId }
            ]
        })
        .populate("sender", "fullName profilePic designation")
        .populate("receiver", "fullName profilePic designation");

        res.status(200).json({
            data: pendingRequests,
        });

    } catch (err) {
        console.log("Error fetching pending connection requests:", err);
        res.status(500).json({ message: "Internal Server Error" });
    }
}