import { decodeToken } from "../../lib/utils.js"
import { EventModel } from "../../models/event.js"


async function fetchAllEvents(req,res){
    try{
        const{userId}=decodeToken(req)
        const allEvents=await EventModel.find({});
       return res.status(200).json({message:"Data fetched Successfully",data:allEvents})
    }
    catch(err){
        console.log("Error in Fetch All Events",err.message)
       return res.status(500).json({message:"Internal Server Error"})
    }
}


export default fetchAllEvents