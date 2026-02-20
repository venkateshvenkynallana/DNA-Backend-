import { uploadFile } from "../../helperFiles/uploadFile.js";
import { decodeToken } from "../../lib/utils.js"
import { EventModel } from "../../models/event.js";


async function createEvent(req,res){
    try{
        const{userId,fullName,email}= decodeToken(req)
        const{eventName,eventLocation,startDate,startTime,description,
            guests,banner,eventTrailer,registrationFee}=req.body;
        if(!(eventName&&eventLocation&&startDate)){
            return res.status(400).json({message:"Please enter all required details"})
        }
         let bannerLink=null;
                // console.log("body in create Event",req.body)
                if(banner){
                    bannerLink=await uploadFile(banner)
                }
        // console.log("in Create Event",req.body)
        const response=await EventModel.insertOne({
            organisedBy:userId,
            eventName,
            eventLocation,
            startDate:new Date(`${startDate}T${startTime}`).toISOString(),
            description,
            guests,
           eventMedia:{
            banner:bannerLink,
            trailer:eventTrailer
           },
           registrationFee:isNaN(parseInt(registrationFee))?0:parseInt(registrationFee)
            
        })

        console.log("Event Created Successfully",response)
       return res.status(201).json({message:"Event Created Successfully"})
    }
    catch(err){
        console.error("error in createEvent.js",err)
       return res.status(500).json({message:"Internal Server Error! Event Creation Failed"})
    }

}

export default createEvent