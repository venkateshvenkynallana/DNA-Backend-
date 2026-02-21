import { decrypt } from "../../lib/encrypt.js";
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
            paymentRefImg: { $ne: null },
            status: "pending",
        });

        const decryptedData = users.map((user)=> {
            return{
                ...user.toObject(),
                fullName: user.fullName,
                phoneNo: decrypt(user.phoneNo),
                status : user.status,
                paymentRefId: user.paymentRefId,
                paymentRefImg: user.paymentRefImg
            }
        })

        return res.status(200).json({
            success: true,
            message: "User with paymennt details fetch successfully...",
            count: users.length,
            data: decryptedData
        });

    } catch (error) {
        console.log("errror fetching payment users", error);
        return res.status(500).json({ message: "Internal Server Error" })
    }
}