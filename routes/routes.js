import express from "express";
import fetchEvents from "../controller/events/fetchEvents.js";
import createEvent from "../controller/events/createEvent.js";
import { protectRoute } from "../middleware/auth.js";


export const router=express.Router()


router.get("/getEvents",fetchEvents)
router.post("/createEvent",createEvent)

