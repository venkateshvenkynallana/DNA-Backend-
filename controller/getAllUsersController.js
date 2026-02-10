import User from "../models/User.js";
import Admin from "../models/Admin.js";

export const getAllUsers = async (req, res) => {
    try {

        const admin = await Admin.findById(req.user._id);

        if (!admin) {
            return res.status(404).json({ message: "Admin not found" });
        }

        const usersList = await User.find().select("-password");

        res.status(200).json({
            success: true,
            totalusers: usersList.length,
            usersList
        })

    } catch (error) {
        console.log("get all users error", error);
        res.status(500).json({ message: "Internal server error" });
    }
}
