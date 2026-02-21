import Connections from "../../models/Connection.js";
import { decodeToken } from "../../lib/utils.js"
import { connect } from "mongoose";
import { getIO, onlineUsers } from "../../lib/socket.js";
import { Notification } from "../../models/notifications.js";
import mongoose from "mongoose";


export const acceptConnectRequest = async (req, res) =>{
    try {
        const { userId } = await decodeToken(req);
         
        const { _id } = req.params;

        const { status } = req.body;
        // const session=mongoose.startSession();

        if(!["accepted", "rejected"].includes(status)){
            return res.status(400).json({ message: "Invalid status value" });
        }

        const connection = await Connections.findById( _id );

        if(!connection){
            return res.status(404).json({message: "Connection request not found"});
        }
        if(connection.receiver.toString() !== userId){
            return res.status(403).json({ message: "Not Authorized" });
        }

        connection.status = status;
        if( status === "rejected"){
            const ONE_WEEK = 7 * 24 * 60 * 60 * 1000; // 7 days 
            connection.deleteAfter = new Date(Date.now() + ONE_WEEK);
        }

        if( status === "accepted"){
            connection.deleteAfter = null;
        }
         const io=getIO()
          const data={
                    notificationType:"Request Accepted",      
                    notificationBy:connection?.sender,
                    notificationTo:connection?.receiver,
                    notificationMessage:`${connection.receiverFullName} has Accepted your friend request`
                }
        
                const recieverSocketId=onlineUsers.get(connection?.sender?.toString())
                console.log("recievreeeeee",recieverSocketId,connection?.sender)
                if(recieverSocketId) io.to(recieverSocketId).emit("notification",data)
                const notifyResponse=await Notification.insertOne(data)
                console.log("Notifyyyyyy responseeee",notifyResponse)
        
        await connection.save();

        res.status(200).json({message: `Connection request ${status}`});

    } catch (error) {
        console.log("Error accepting connection request:", error);
        res.status(500).json({message: "Internal Server Error"});
    }
}