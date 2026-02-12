import express from "express";
import dotenv from "dotenv"
dotenv.config()

import {connectDB} from "./lib/db.js";
import cors from "cors";
import http from "http";
import userRouter from "./routes/userRoutes.js";
import routes from "./routes/routes.js";
import adminRouter from "./routes/adminRoutes.js";
import { router } from "./routes/routes.js";


const app = express();
const server = http.createServer(app);



const allowedOrigins=[
  "https://dna-frontend-eosin.vercel.app",
  "http://localhost:5173",
]
app.use(cors({
  origin:allowedOrigins,
  methods:["GET","POST","PUT","DELETE","OPTIONS"],
  credentials:true
}))

//connect to mongoDB
await connectDB();


app.use(express.json({limit: "4mb"}));

//routes  
app.use("/api/status", (req, res) => {
  res.send("Server in live");
});
app.use("/api/auth", userRouter);  
app.use("/api/admin", adminRouter);
app.use("/api", routes);

app.use("/api",router)



const PORT = process.env.PORT ;

server.listen(PORT, () => {
  console.log("Backend running on port : "+ PORT);
});
