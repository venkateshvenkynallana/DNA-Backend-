import express from 'express';
import { addRole, addUser, adminLogin, adminRegister, blockUser, deleteRole, deleteUser, getAllUsersByAdmin, getHomePageData, getOneRole, getRoles, updateRole, updateUser } from '../controller/adminController.js';
import { adminAccessCheck } from '../middleware/accessCheck.js';
import fetchEvents from '../controller/events/fetchEvents.js';
import upload from '../middleware/multer.js';

import { getAllUsers } from '../controller/getAllUsersController.js';
import deleteEvent from "../controller/events/deleteEvent.js";
import updateEvent from"../controller/events/updateEvent.js"
import createEvent from '../controller/events/createEvent.js';


const adminRouter = express.Router();



adminRouter.get("/getHomePageData",getHomePageData)

adminRouter.get("/getRoles",adminAccessCheck("roles:read"),getRoles)
adminRouter.get("/getRole/:id",adminAccessCheck("roles:read"),getOneRole)
adminRouter.post("/addRole",adminAccessCheck("role:write"),addRole)
// adminRouter.post("/addRole",addRole)
adminRouter.put("/updateRole/:roleId",adminAccessCheck("roles:update"),updateRole)
adminRouter.delete("/deleteRole/:roleId",adminAccessCheck("roles:delete"),deleteRole)



adminRouter.get("/getEvents", adminAccessCheck("events:read"), fetchEvents)
adminRouter.post("/createEvent", adminAccessCheck("events:write"),
    upload.fields([
        { name: "banner", maxCount: 1 }]), createEvent)
adminRouter.delete("/deleteEvent/:id", adminAccessCheck("events:delete"), deleteEvent)
// adminRouter.delete("/deleteEvent/:id",deleteEvent)

adminRouter.put("/updateEvent/:id",adminAccessCheck("events:update"),upload.fields([
        { name: "banner", maxCount: 1 },
    ]),updateEvent)


adminRouter.get("/users",adminAccessCheck("members:read"), getAllUsers);
//route block the user by admin
adminRouter.put("/blockUser/:id" ,adminAccessCheck("members:update"), blockUser)



// routes for users in admin for adding roles

adminRouter.get("/getAllUsersByAdmin",adminAccessCheck("users:read"),getAllUsersByAdmin)
adminRouter.post("/addUser",adminAccessCheck("users:write"),addUser)
adminRouter.delete("/deleteUser/:id",adminAccessCheck("users:delete"), deleteUser);
adminRouter.patch("/updateUser",adminAccessCheck("users:update"),updateUser)

export default adminRouter;
