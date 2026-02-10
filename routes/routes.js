import express from "express";
import fetchEvents from "../controller/events/fetchEvents.js";
import createEvent from "../controller/events/createEvent.js";
import { protectRoute } from "../middleware/auth.js";
import { protectAdminRoute } from '../middleware/auth.js';
import { getAllUsers } from '../controller/getAllUsersController.js';


export const router=express.Router()


router.get("/getEvents",fetchEvents)
router.post("/createEvent",createEvent)
router.get("/users", protectAdminRoute, getAllUsers);

export default router;