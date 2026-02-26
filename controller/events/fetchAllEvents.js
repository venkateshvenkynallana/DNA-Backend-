import { decodeToken } from "../../lib/utils.js"
import { EventModel } from "../../models/event.js"
import { RegistrationModel } from "../../models/EventsRegistration.js";


async function fetchAllEvents(req,res){
    try{
        const{userId}=decodeToken(req)
        const allEvents=await EventModel.find({}).populate("organisedBy");
         const decryptedData=allEvents.map(event=>(
                {
                    ...event.toObject(),
                    organisedBy:{
                        ...event.organisedBy.toObject(),
                    email:event.organisedBy.email?decrypt(event.organisedBy.email):null,
                    phoneNo:event.organisedBy.phoneNo?decrypt(event.organisedBy.phoneNo):null
                }
        
                }
            ))
       return res.status(200).json({message:"Data fetched Successfully",data:decryptedData})
    }
    catch(err){
        console.log("Error in Fetch All Events",err.message)
       return res.status(500).json({message:"Internal Server Error"})
    }
}


export default fetchAllEvents