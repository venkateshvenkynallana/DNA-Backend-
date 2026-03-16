import express from "express";
import { adminLogin, adminRegister } from "../controller/adminController.js";
import { forgotPassword, getProfileDetailsPublic, Login, resetPassword, signUp, verifyOtp } from "../controller/userController.js";
import { getPaymentUser, paymentController } from "../controller/payments/paymentController.js";
import upload from "../middleware/multer.js";
import { getViewProfile } from "../controller/getAllUsersController.js";
import { decodeToken } from "../lib/utils.js";


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

authRouter.get("/viewProfileDetails", getProfileDetailsPublic);

authRouter.get("/getviewprofile/:userId", getViewProfile);

authRouter.post("/signOut",(req,res)=>{
    res.clearCookie("loginToken",{httpOnly: true,
  secure: true, 
  sameSite: "none", 
  path: "/"})
    res.status(200).json({ message: "Logged out successfully" });

})

authRouter.get("/authCheck",(req,res)=>{
    try{
        const {userId}=decodeToken(req) || {userId:null}

        if(!userId){
           return res.status(401).json({message:"You Are Not Authenticated"})
        }

       return res.status(200).json({message:"Authorization Successfull"})
    }
    catch(error){
        console.log("Error in Auth Check in userRoutes",error)
        res.status(500).json({message:"UnAuthorized"})
    }
})


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