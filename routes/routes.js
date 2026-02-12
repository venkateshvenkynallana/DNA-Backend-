import express from "express";
import fetchEvents from "../controller/events/fetchEvents.js";
import createEvent from "../controller/events/createEvent.js";
import { protectUserRoute } from "../middleware/auth.js";
import { protectAdminRoute } from '../middleware/auth.js';
import { getAllUsers, getUsersInUserDashboard } from '../controller/getAllUsersController.js';
import deleteEvent from "../controller/events/deleteEvent.js";
import updateEvent from"../controller/events/updateEvent.js"
import fetchAllEvents from "../controller/events/fetchAllEvents.js";
import upload from "../middleware/multer.js";

export const router=express.Router()


router.get("/getEvents",protectAdminRoute,fetchEvents)
router.post("/createEvent",protectAdminRoute,upload.fields([
        { name: "banner", maxCount: 1 }]),createEvent)
router.delete("/deleteEvent/:id",protectAdminRoute,deleteEvent)
router.put("/updateEvent/:id",protectAdminRoute,upload.fields([
        { name: "banner", maxCount: 1 },
    ]),updateEvent)

router.get("/getAllEvents",protectUserRoute,fetchAllEvents)

router.get("/users", protectAdminRoute, getAllUsers);

router.get("/userscount", protectUserRoute, getUsersInUserDashboard);

export default router;