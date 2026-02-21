import express from "express";
import dotenv from "dotenv"
dotenv.config()

import {connectDB, updateFields} from "./lib/db.js";
import cors from "cors";
import http from "http";
import userRouter from "./routes/userRoutes.js";
import routes from "./routes/authRoutes.js";
import adminRouter from "./routes/adminRoutes.js";
import authRouter from "./routes/authRoutes.js";
import crypto from "crypto"
import cloudinarySetup from "./lib/cloudinary.js";
import resendSetup from "./lib/mailer.js";
import User from "./models/User.js";
import { protectAdminRoute, protectUserRoute } from "./middleware/auth.js";
import connectRouter from "./routes/connectRoutes.js";
// import { connectEncrypted, createKey } from "./lib/encrypt.js";
import dns from 'node:dns/promises';
import { socketSetup } from "./lib/socket.js";
import { Server } from "socket.io";

dns.setServers(['1.1.1.1', '1.0.0.1']);

const app = express();
const server = http.createServer(app);


cloudinarySetup();
resendSetup();
socketSetup(server,app)


const allowedOrigins=[
  "https://dna-frontend-eosin.vercel.app",
  "http://localhost:5173",
]
app.use(cors({
  origin:allowedOrigins,
  methods:["GET","POST","PUT","DELETE","PATCH","OPTIONS"],
  credentials:true
}))

//connect to mongoDB
await connectDB();
// updateFields()


app.use(express.json({limit: "4mb"}));

//routes  
app.use("/api/status", (req, res) => {
  res.send("Server in live");
});
app.use("/api/user",protectUserRoute, userRouter);  
app.use("/api/admin",protectAdminRoute, adminRouter);
// app.use("/api", routes);

//connect network route
app.use("/api/connections", connectRouter)

app.use("/api/auth",authRouter)


const PORT = process.env.PORT||5000 ;

server.listen(PORT, () => {
  console.log("Backend running on port : "+ PORT);
});
