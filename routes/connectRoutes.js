import express from "express";
import { sendConnectionRequest } from "../controller/connections/sendConnectionController.js";
import { protectUserRoute } from "../middleware/auth.js";
import { acceptConnectRequest } from "../controller/connections/acceptConnectRequest.js";
import { getConnectionsController } from "../controller/connections/getConnectionsController.js";
import { getPendingRequestsController } from "../controller/connections/pendingRequestController.js";


export const connectRouter = express.Router()

connectRouter.post("/send", protectUserRoute, sendConnectionRequest);

connectRouter.put("/accept/:_id", protectUserRoute, acceptConnectRequest);


connectRouter.get("/pending", protectUserRoute, getPendingRequestsController)

connectRouter.get("/", protectUserRoute, getConnectionsController);

export default connectRouter;