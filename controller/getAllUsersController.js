import User from "../models/User.js";
import Admin from "../models/Admin.js";
import { decodeToken } from "../lib/utils.js";
import { decrypt } from "../lib/encrypt.js";

export const getAllUsers = async (req, res) => {
    try {
        const{userId}=decodeToken(req)
        const admin = await Admin.findById(userId);

        if (!admin) {
            return res.status(404).json({ message: "Admin not found" });
        }

        const usersList = await User.find().select("-password");
        const decryptedData = usersList.map((user) => {
            return {
                ...user.toObject(), // convert mongoose doc → plain object
                email: decrypt(user.email),
                phoneNo: decrypt(user.phoneNo),
                designation:decrypt(user.designation)
            };
        });
        res.status(200).json({
            success: true,
            totalusers: usersList.length,
            data:decryptedData
        })

    } catch (error) {
        console.log("get all users error", error);
        res.status(500).json({ message: "Internal server error" });
    }
}



export const getUsersInUserDashboard = async(req, res) =>{
    try {
        const {userId} = decodeToken(req);
        const user = await User.find(
            {_id: {$ne: userId}}
        ).select("-password");

        res.status(200).json({
            success: true,
            usersCount: user.length,
            usersList: user
        });
    } catch (error) {
        console.log("get users in user dashboard error", error);
        res.status(500).json({ message: "Internal server error" });
    }
}