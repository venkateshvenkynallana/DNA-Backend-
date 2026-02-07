import express from 'express';
import { adminLogin, adminRegister } from '../controller/adminController.js';

const adminRouter = express.Router();

//Admin registration route

adminRouter.post("/register", adminRegister)

//Admin login route

adminRouter.post("/login", adminLogin);

export default adminRouter;
