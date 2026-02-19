import { v2 as cloudinary } from "cloudinary";
import User from "../../models/User.js";
import resendSetup from "../../lib/mailer.js";
import { decrypt } from "../../lib/encrypt.js";

export const paymentController = async (req, res) => {
    try {
        const { paymentRefId, paymentRefImg } = req.body;
        const { userId } = req.params;

        console.log("Payment Details Received:", { paymentRefId, userId, paymentRefImg });

        if (!userId) {
            return res.status(400).json({ message: "User ID is required" });
        }
        if (!paymentRefId) {
            return res.status(400).json({ message: "All fields are required" });
        }
        const file = req.files?.paymentRefImg?.[0];

        if (!paymentRefId || !file) {
            return res.status(400).json({
                message: "All fields are required",
                debug: { paymentRefId, fileReceived: !!file, files: req.files }  // remove in prod
            });
        }

        let paymentImageLink = null;

        if (file && file.buffer) {
            paymentImageLink = await new Promise((resolve, reject) => {
                const stream = cloudinary.uploader.upload_stream(
                    { folder: "payment_refs" },
                    (error, result) => {
                        if (error) reject(error);
                        else resolve(result.secure_url);
                    }
                );
                stream.end(file.buffer);
            });
        } else if (paymentRefImg && typeof paymentRefImg === "string") {
            const result = await cloudinary.uploader.upload(paymentRefImg, {
                folder: "payment_refs"
            });
            paymentImageLink = result.secure_url;
        }

        console.log("Cloudinary URL:", paymentImageLink);

        const updatePayment = await User.findByIdAndUpdate(
            userId,
            {
                paymentRefImg: paymentImageLink,
                paymentRefId
            },
            { new: true }
        );

        if (!updatePayment) {
            return res.status(404).json({ message: "User Not Found" });
        }

        res.status(200).json({
            message: "Payment Details Updated Successfully",
            user: updatePayment
        });

    } catch (error) {
        console.log("Payment controller error:", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
};


// payment details verified the admin
export const verifyPaymentDetails = async (req, res) => {
    try {
        const { userId } = req.params;

        if (!userId) {
            return res.status(404).json({ message: "Missing userId....!" })
        }

        const updateData = await User.findByIdAndUpdate(
            userId,
            {
                status: "verified"
            },
            { new: true }
        )

        if (!updateData) {
            return res.status(404).json({ message: "User not found...!" })
        }

        return res.status(200).json({
            success: true,
            message: "User Status Updated successfully.",
            user: updateData
        });

    } catch (error) {
        console.log("verify payment details error", error);;
        res.status(500).json({ message: "Internal Server Error" })
    }
}

export const paymentNotification = async (req, res) => {
    try {
        const { userId } = req.params;
        if (!userId) {
            return res.status(404).json({ message: "USer not found...!" })
        }
        const user = await User.findById(userId);
        console.log("useremail",decrypt(user.email))
        if (!user) {
            return res.status(404).json({ message: "User not found in DB" })
        }
        await resendSetup().emails?.send({
            from: "dna-support@dna.hi9.in",
            to: decrypt(user.email),
            subject: "Payment Details Verification Required",
            html: `
        <div style="font-family: Arial, sans-serif; line-height: 1.6;">
            <h2>Hello ${user.fullName},</h2>

            <p>We reviewed your submitted payment details and found some incorrect or incomplete information.</p>

            <p style="color: red; font-weight: bold;">
                Please check your payment reference details and re-upload the correct information.
            </p>

            <br/>

            <p>Regards,<br/>
            DNA Support Team</p>
        </div>
    `
        });
        return res.status(200).json({
            success: true,
            message: "Email sent successfully."
        })

    } catch (error) {
        console.log("notification sending error")
        res.status(500).json({ message: "Internal Server Error...!" })
    }
}