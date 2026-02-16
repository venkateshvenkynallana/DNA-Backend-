import express from "express";
import { checkAuth, forgotPassword, Login, resetPassword, signUp, updateProfile, verifyOtp } from "../controller/userController.js";
import upload from "../middleware/multer.js";
import { getUsersInUserDashboard } from '../controller/getAllUsersController.js';
import fetchAllEvents from "../controller/events/fetchAllEvents.js";
import { accessCheck } from "../middleware/accessCheck.js";

const userRouter = express.Router();

//user routes 

userRouter.put(
    "/update-profile",
    upload.fields([
        { name: "profilepic", maxCount: 1 },
        { name: "mediaUploadImages", maxCount: 10 }
    ]),
    updateProfile
);

userRouter.get("/check", checkAuth);

//reset password routes



userRouter.get("/userscount", getUsersInUserDashboard);
userRouter.get("/getAllEvents",accessCheck("events:read"),fetchAllEvents)


export default userRouter;