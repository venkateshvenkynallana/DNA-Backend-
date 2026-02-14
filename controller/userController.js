import User from "../models/User.js";
import bcrypt from "bcryptjs";
import { generateToken } from "../lib/utils.js";
import cloudinary from "../lib/cloudinary.js";
import resend from "../lib/mailer.js";


//Sign up form
export const signUp = async (req, res) => {

    const { fullName, email, password, bio, phoneNo, designation } = req.body;

    try {
        if (!fullName || !email || !password || !phoneNo || !designation) {
            return res.status(400).json({ message: "fields are missing." });
        }

        const user = await User.findOne({ email });

        if (user) {
            return res.status(409).json({ message: "User already exists." });
        }

        //password hashing
        const salt = await bcrypt.genSalt(10);

        const hashedPassword = await bcrypt.hash(password, salt);

        const newUser = await User.create({
            fullName,
            email,
            password: hashedPassword,
            bio,
            phoneNo,
            designation,
        });

        // mail sending logic 
        const mailSend = {

            to: email,
            subject: "🎉 Welcome to DNA – Your Account is Ready!",
            html: `
                <div style="font-family: Arial, sans-serif; background-color: #f4f6f8; padding: 30px;">
                    <div style="max-width: 600px; margin: auto; background: #ffffff; padding: 30px; border-radius: 8px; box-shadow: 0 4px 10px rgba(0,0,0,0.05);">
                        
                        <h2 style="color: #2c3e50; margin-bottom: 10px;">
                            Welcome to DNA, ${newUser.fullName}! 🎉
                        </h2>
                        
                        <p style="font-size: 15px; color: #555;">
                            We're excited to have you on board. Your account has been successfully created.
                        </p>

                        <p style="font-size: 15px; color: #555;">
                            You can now log in and start exploring all the features available to you.
                        </p>

                        <div style="text-align: center; margin: 30px 0;">
                            <a href="https://dna-frontend-eosin.vercel.app?isLogin=true" 
                            style="background-color: #4CAF50; color: #ffffff; padding: 12px 25px; text-decoration: none; border-radius: 5px; font-size: 14px;">
                            Login to Your Account
                            </a>
                        </div>

                        <hr style="margin: 20px 0;" />

                        <p style="font-size: 14px; color: #888;">
                            If you didn't create this account, please report it immediately.
                        </p>

                        <div style="text-align: center; margin-top: 15px;">
                            <a href="" 
                            style="background-color: #e74c3c; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px;">
                            🚨 Report This Account
                            </a>
                        </div>

                        <hr style="border: none; border-top: 1px solid #eee; margin: 25px 0;" />

                        <p style="font-size: 13px; color: #999;">
                            © ${new Date().getFullYear()} DNA. All rights reserved.
                        </p>

                    </div>
                </div>
            `
        }


        const response = await resend.emails.send({
            from: "dna-support@dna.hi9.in",
            to: email,
            subject: mailSend.subject,
            html: mailSend.html
        });


        const token = generateToken(newUser._id);

        res.status(200).json({ success: true, userData: newUser, token, message: "Account created successfully." });

    } catch (error) {
        console.log("create the user error", error);
        return res.status(500).json({ message: "Internal server error." });
    }
}

//login user 

export const Login = async (req, res) => {
    try {
        const { email, password } = req.body;
        console.log({email,password})
        if(!email||!password){
            return res.status(400).json({message:"Plase enter all credentials"})
        }

        const userData = await User.findOne({ email });
        console.log({userData})

        if(!userData){
            return res.status(400).json({message:"User not found"})
        }

        //check if user is pending
        if(userData.status === "pending"){
            return res.status(403).json({message : "Your account is pending verification. Please wait for the verification process to complete."})
        }
        //check if user is blocked
        if(userData.status === "blocked"){
            return res.status(403).json({message: "Your account has been blocked. Please contact support."})
        }

        const isPassword = await bcrypt.compare(password, userData.password);

        if (!isPassword) {
            return res.status(409).json({ message: "Invalid credentials." });
        }

        console.log(
            {userData}
        )

        const token = generateToken(userData);
    //     res.cookie("loginToken", token, {
    //     httpOnly: true,
    //     secure: true,
    //     sameSite: "none",
    //     expires: new Date(expirationTime),
    //     path :"/"
    //   });
       return res.status(200).json({ success: true,userData, token, message: "Login successful." });

    } catch (error) {
        console.error("login error", error.message);
        res.status(500).json({ message: "Internal Server Error" });
    }
}

//controller to check if user is authenticated 
export const checkAuth = async (req, res) => {
    res.status(200).json({ success: true, user: req.user });
}

//controller update user profile details
export const updateProfile = async (req, res) => {
    try {
        const userId = req.user._id;

        const updateData = {};

        console.log("req body update profile:---", req.body);

        // ===== basic fields =====
        if (req.body.fullName) updateData.fullName = req.body.fullName;
        if (req.body.email) updateData.email = req.body.email;
        if (req.body.bio) updateData.bio = req.body.bio;
        if (req.body.phoneNo) updateData.phoneNo = req.body.phoneNo;
        if (req.body.designation) updateData.designation = req.body.designation;
        if (req.body.hospitalName) updateData.hospitalName = req.body.hospitalName;

        // ===== years of experience =====
        if (req.body.yearsOfExperience) {
            updateData["profile.yearsOfExperience"] = req.body.yearsOfExperience;
        }

        if (req.body.introVideo) {
            updateData["profile.introVideo"] = req.body.introVideo;
        }

        // ===== experience (parse JSON string) =====
        if (req.body.experience) {
            try {
                const experienceData = JSON.parse(req.body.experience);
                updateData["profile.experience"] = experienceData.map(exp => ({
                    jobTitle: req.body.designation || "",
                    hospital: exp.hospital || "",
                    from: exp.duration?.from || "",
                    to: exp.duration?.to || ""
                }));
            } catch (e) {
                console.error("Error parsing experience:", e);
            }
        }

        // ===== education (parse JSON string) =====
        if (req.body.education) {
            try {
                const educationData = JSON.parse(req.body.education);

                updateData["profile.education"] = educationData.map(edu => ({
                    degree: edu.degree || "",
                    university: edu.university || "",
                    year: edu.year || ""
                }));
            } catch (e) {
                console.error("Error parsing education:", e);
            }
        }


        // ===== achievements (parse JSON string) =====
        if (req.body.achievements) {
            try {
                const achievementsData = JSON.parse(req.body.achievements);

                updateData["profile.achievements"] = achievementsData.map(ach => ({
                    achievementsName: ach.name || "",
                    issuingOrganization: ach.organization || "",
                    achievementsImages: ""
                }));
            } catch (e) {
                console.error("Error parsing achievements:", e);
            }
        }

        // ===== interests (parse JSON string) =====
        // if (req.body.interests) {
        //     try {
        //         const interestsData = JSON.parse(req.body.interests);
        //         updateData["profile.Interests"] = interestsData;
        //     } catch (e) {
        //         console.error("Error parsing interests:", e);
        //     }
        // }

        // ===== videos/mediaUpload (parse JSON string) =====
        if (req.body.mediaUpload) {
            try {
                const videos = Array.isArray(req.body.mediaUpload)
                    ? req.body.mediaUpload
                    : [req.body.mediaUpload];

                updateData["profile.mediaUpload"] = videos.map(v =>
                    typeof v === "string" ? JSON.parse(v) : v
                );
            } catch (e) {
                console.error("Error parsing videos:", e);
            }
        }

        // ===== gallery images (AFTER videos) =====
        if (req.files?.mediaUploadImages) {
            const uploadedImages = [];

            for (const file of req.files.mediaUploadImages) {
                const upload = await cloudinary.uploader.upload(
                    `data:${file.mimetype};base64,${file.buffer.toString("base64")}`
                );

                uploadedImages.push({
                    type: "image",
                    url: upload.secure_url,
                    date: new Date().toISOString().split("T")[0]
                });
            }

            updateData["profile.mediaUpload"] = [
                ...(updateData["profile.mediaUpload"] || []),
                ...uploadedImages
            ];
        }




        // ===== profile picture upload =====
        if (req.files?.profilepic && req.files.profilepic.length > 0) {
            const file = req.files.profilepic[0];

            const uploadResult = await cloudinary.uploader.upload(
                `data:${file.mimetype};base64,${file.buffer.toString("base64")}`
            );

            updateData.profilepic = uploadResult.secure_url;
        }


        console.log("Final updateData:", updateData);

        const updatedUser = await User.findByIdAndUpdate(
            userId,
            { $set: updateData },
            { new: true, runValidators: true }
        );

        res.status(200).json({
            success: true,
            user: updatedUser,
            message: "Profile updated successfully"
        });

    } catch (error) {
        console.error("update profile error", error);
        res.status(500).json({ message: error.message });
        console.error("update profile error", error);
        res.status(500).json({ message: error.message });
    }
};



//controller to handle forgot password
export const forgotPassword = async (req, res) => {
    try {
        const { email } = req.body;

        const user = await User.findOne({ email });

        if (!user) {
            return res.status(404).json({ message: "User not found." });
        }

        // generate 6 digit OTP
        const otp = Math.floor(100000 + Math.random() * 900000);

        user.resetOtp = otp;
        user.otpExpire = Date.now() + 10 * 60 * 1000; // 10 minutes

        await user.save();


        const mailOptions = {
            subject: "Verify your email",
            html: `<p>Your OTP is <b>${otp}</b></p>`
        };


        await resend.emails.send({
            from: "dna-support@dna.hi9.in",
            to: email,
            subject: mailOptions.subject,
            html: mailOptions.html
        })

        res.status(200).json({ message: "OTP sent to email " });
    } catch (error) {
        console.log("forget password error", error);
        res.status(500).json({ message: "Internal server error." });
    }
}


//verify otp controller
export const verifyOtp = async (req, res) => {
    try {
        const { email, otp } = req.body;

        const user = await User.findOne({ email });

        if (
            !user ||
            user.resetOtp !== Number(otp) ||
            user.otpExpire < Date.now()
        ) {
            return res.status(400).json({ message: "Invalid or expired OTP." });
        }

        res.status(200).json({ success: true, message: "OTP verified successfully." });

    } catch (error) {
        console.log("verify otp error", error);
        res.status(500).json({ message: "Internal server error." });
    }
}


//reset password controller
export const resetPassword = async (req, res) => {
    try {

        const { email, newPassword } = req.body;

        const user = await User.findOne({ email });

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(newPassword, salt);

        user.password = hashedPassword;

        user.resetOtp = null;
        user.otpExpire = null;

        await user.save();

        res.status(200).json({ success: true, message: "Password reset successfully." });

    } catch (error) {
        console.log("reset password error", error);
        res.status(500).json({ message: "Internal server error." });
    }
}