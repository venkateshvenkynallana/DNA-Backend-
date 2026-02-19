import express from "express";
import { adminLogin, adminRegister } from "../controller/adminController.js";
import { forgotPassword, Login, resetPassword, signUp, verifyOtp } from "../controller/userController.js";
import { getPaymentUser, paymentController } from "../controller/payments/paymentController.js";
import upload from "../middleware/multer.js";


export const authRouter=express.Router()


//Admin registration route

authRouter.post("/adminRegister", adminRegister)

//Admin login route

authRouter.post("/adminLogin", adminLogin);


authRouter.post("/userSignUp", signUp);
authRouter.post("/userLogin", Login)

authRouter.post("/forget-password", forgotPassword);
authRouter.post("/verify-otp", verifyOtp);
authRouter.post("/reset-password", resetPassword)

authRouter.post("/payment/:userId", upload.fields([
    { name: "paymentRefImg", maxCount: 1 }
]), paymentController);

//user get the email
authRouter.get("/getUserDetails", getPaymentUser)

// router.get("/getEvents",protectAdminRoute,accessCheck("events:read"),fetchEvents)
// router.post("/createEvent",protectAdminRoute,accessCheck("events:write"),upload.fields([
//         { name: "banner", maxCount: 1 }]),createEvent)
// router.delete("/deleteEvent/:id",protectAdminRoute,accessCheck("events:delete"),deleteEvent)
// // router.delete("/deleteEvent/:id",deleteEvent)

// router.put("/updateEvent/:id",protectAdminRoute,accessCheck("events:update"),upload.fields([
//         { name: "banner", maxCount: 1 },
//     ]),updateEvent)

// router.get("/getAllEvents",protectUserRoute,accessCheck("events:read"),fetchAllEvents)

// router.get("/users", protectAdminRoute,accessCheck("users:read"), getAllUsers);

// router.get("/userscount", protectUserRoute, getUsersInUserDashboard);


export default authRouter;