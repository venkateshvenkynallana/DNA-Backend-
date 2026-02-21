import { decrypt } from "../../lib/encrypt.js";
import { decodeToken } from "../../lib/utils.js"
import { EventModel } from "../../models/event.js";



async function fetchEvents(req,res){
   try{ 
    const{userId}=decodeToken(req);
    const events=await EventModel.find({
        organisedBy:userId
    }).populate("organisedBy")
    // console.log("Evnts in fetchEventsss",events)
    const decryptedData=events.map(event=>(
        {
            ...event.toObject(),
            organisedBy:{
                ...event.organisedBy.toObject(),
            email:event.organisedBy.email?decrypt(event.organisedBy.email):null,
            phoneNo:event.organisedBy.phoneNo?decrypt(event.organisedBy.phoneNo):null
        }

        }
    ))
    // console.log({decryptedData})
    return res.status(200).json({message:"Events Fetched Successfully",data:decryptedData})

    }
    catch(err){
        console.error("error in fetchEvent.js",err)
       return res.status(500).json({message:"Internal Server Error"})
    }

}

export default fetchEvents