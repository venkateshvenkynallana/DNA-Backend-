
import express from 'express';
import { getAllUsers } from '../controller/getAllUsersController.js';
import { protectAdminRoute } from '../middleware/auth.js';

const router = express.Router();

router.get("/users", protectAdminRoute, getAllUsers);

export default router;