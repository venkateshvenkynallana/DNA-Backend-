import { decodeToken } from "../../lib/utils.js"
import { EventModel } from "../../models/event.js";



async function fetchEvents(req,res){
   try{ 
    const{userId}=decodeToken(req);
    const events=await EventModel.find({
        organisedBy:userId
    })
    console.log({events})
    return res.status(200).json({message:"Events Fetched Successfully",data:events})

    }
    catch(err){
        console.error("error in fetchEvent.js",err.message)
       return res.status(500).json({message:"Internal Server Error"})
    }

}

export default fetchEvents