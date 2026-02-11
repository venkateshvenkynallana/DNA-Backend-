
import express from 'express';
import { getAllUsers, getUsersInUserDashboard } from '../controller/getAllUsersController.js';
import { protectAdminRoute } from '../middleware/auth.js';
import { protectRoute } from "../middleware/auth.js";

const router = express.Router();

router.get("/users", protectAdminRoute, getAllUsers);

router.get("/userscount", protectRoute, getUsersInUserDashboard);

export default router;