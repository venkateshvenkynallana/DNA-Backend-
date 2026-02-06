import express from "express";
import { checkAuth, forgotPassword, Login, resetPassword, signUp, updateProfile, verifyOtp } from "../controller/userController.js";
import { protectRoute } from "../middleware/auth.js";
import upload from "../middleware/multer.js";

const userRouter = express.Router();

//user routes 
userRouter.post("/signup", signUp);
userRouter.post("/login", Login);
userRouter.put(
    "/update-profile",
    protectRoute,
    upload.fields([
        { name: "profilepic", maxCount: 1 },
        { name: "mediaUploadImages", maxCount: 10 }
    ]),
    updateProfile
);

userRouter.get("/check", protectRoute, checkAuth);

//reset password routes
userRouter.post("/forget-password", forgotPassword);
userRouter.post("/verify-otp", verifyOtp);
userRouter.post("/reset-password", resetPassword)

export default userRouter;