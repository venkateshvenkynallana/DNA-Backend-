import express from 'express';
import { addRole, addUser, adminLogin, adminRegister, blockUser, deleteRole, deleteUser, getAllUsersByAdmin, getHomePageData, getOneRole, getRoles, updateMemberRole, updateRole, updateUser } from '../controller/adminController.js';
import { accessCheck } from '../middleware/accessCheck.js';
import fetchEvents from '../controller/events/fetchEvents.js';
import upload from '../middleware/multer.js';

import { getAllUsers } from '../controller/getAllUsersController.js';
import deleteEvent from "../controller/events/deleteEvent.js";
import updateEvent from"../controller/events/updateEvent.js"
import createEvent from '../controller/events/createEvent.js';
import { getPaymentDetails } from '../controller/payments/getPaymentDetails.js';
import { paymentNotification, verifyPaymentDetails } from '../controller/payments/paymentController.js';
import { updateProfile } from '../controller/userController.js';


const adminRouter = express.Router();



adminRouter.get("/getHomePageData",getHomePageData)

adminRouter.get("/getRoles",accessCheck("roles:read"),getRoles)
adminRouter.get("/getRole/:id",accessCheck("roles:read"),getOneRole)
adminRouter.post("/addRole",accessCheck("role:write"),addRole)
// adminRouter.post("/addRole",addRole)
adminRouter.put("/updateRole/:roleId",accessCheck("roles:update"),updateRole)
adminRouter.delete("/deleteRole/:roleId",accessCheck("roles:delete"),deleteRole)



adminRouter.get("/getEvents", accessCheck("events:read"), fetchEvents)
adminRouter.post("/createEvent", accessCheck("events:write"),
    upload.fields([
        { name: "banner", maxCount: 1 }]), createEvent)
adminRouter.delete("/deleteEvent/:id", accessCheck("events:delete"), deleteEvent)
// adminRouter.delete("/deleteEvent/:id",deleteEvent)

adminRouter.put("/updateEvent/:id",accessCheck("events:update"),upload.fields([
        { name: "banner", maxCount: 1 },
    ]),updateEvent)


adminRouter.get("/users",accessCheck("members:read"), getAllUsers);
//route block the user by admin
adminRouter.put("/blockUser/:id" ,accessCheck("members:update"), blockUser)
adminRouter.patch("/updateMemberRole",accessCheck("members:update"),updateMemberRole)


adminRouter.put(
    "/update-profile",accessCheck("members:update"),
    upload.fields([
        { name: "profilepic", maxCount: 1 },
        { name: "mediaUploadImages", maxCount: 10 }
    ]),
    updateProfile
);


// routes for users in admin for adding roles

adminRouter.get("/getAllUsersByAdmin",accessCheck("users:read"),getAllUsersByAdmin)
adminRouter.post("/addUser",accessCheck("users:write"),addUser)
adminRouter.delete("/deleteUser/:id",accessCheck("users:delete"), deleteUser);
adminRouter.put("/updateUser",accessCheck("users:update"),updateUser)



//route for fetch payment user details
adminRouter.get("/payment",accessCheck("payments:read"), getPaymentDetails)

//admin send mail user
adminRouter.put("/mail/:userId",accessCheck("payments:update"), paymentNotification)

//admin verified the user
adminRouter.put("/verify/:userId",accessCheck("payments:update"), verifyPaymentDetails)


export default adminRouter;
