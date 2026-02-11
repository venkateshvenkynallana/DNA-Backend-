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



export const getUsersInUserDashboard = async(req, res) =>{
    try {
        const user = await User.countDocuments();

        res.status(200).json({
            success: true,
            usersCount: user
        });
    } catch (error) {
        console.log("get users in user dashboard error", error);
        res.status(500).json({ message: "Internal server error" });
    }
}