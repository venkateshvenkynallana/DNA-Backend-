import Connections from "../../models/Connection.js";
import { decodeToken } from "../../lib/utils.js"


export const acceptConnectRequest = async (req, res) =>{
    try {
        const { userId } = await decodeToken(req);
         
        const { _id } = req.params;

        const { status } = req.body;

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
        
        await connection.save();

        res.status(200).json({message: `Connection request ${status}`});

    } catch (error) {
        console.log("Error accepting connection request:", error);
        res.status(500).json({message: "Internal Server Error"});
    }
}