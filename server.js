import express from "express";
import "dotenv/config";
import {connectDB} from "./lib/db.js";
import cors from "cors";
import http from "http";
import userRouter from "./routes/userRoutes.js";
import routes from "./routes/routes.js";
import adminRouter from "./routes/adminRoutes.js";



const app = express();
const server = http.createServer(app);

app.use(express.json({limit: "4mb"}));
app.use(cors())

//routes  
app.use("/api/status", (req, res) => {
  res.send("Server in live");
});

app.use("/api/auth", userRouter);  
app.use("/api/admin", adminRouter);
app.use("/api", routes);

//connect to mongoDB
await connectDB();

const PORT = process.env.PORT || 5000;

server.listen(PORT, () => {
  console.log("Backend running on port : "+ PORT);
});
