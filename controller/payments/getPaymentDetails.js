import { decodeToken } from "../../lib/utils.js";
import Admin from "../../models/Admin.js";
import User from "../../models/User.js"


export const getPaymentDetails = async (req, res) => {
    try {
        const { userId } = decodeToken(req)
        const admin = await Admin.findById(userId);

        if (!admin) {
            return res.status(404).json({ message: "Admin not found" });
        }

        const users = await User.find({
            paymentRefId: { $ne: null },
            paymentRefImg: { $ne: null }
        }).populate("role");

        if (!users || users.length === 0) {
            return res.status(404).json({ success: false, message: "No Users found with Payment Details" })
        }

        return res.status(200).json({
            success: true,
            message: "User with paymennt details fetch successfully...",
            count: users.length,
            data: users
        });

    } catch (error) {
        console.log("errror fetching payment users", error);
        return res.status(500).json({ message: "Internal Server Error" })
    }
}