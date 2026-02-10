import { decodeToken } from "../../lib/utils.js"
import { EventModel } from "../../models/event.js";


async function createEvent(req,res){
    try{
        const{userId,fullName,email}= decodeToken(req)
        const{eventName,eventLocation,startDate,startTime,description,guests,bannerImg,eventTrailer,registrationFee}=req.body;
        if(!(eventName&&eventLocation&&startDate)){
            return res.status(400).json({message:"Please enter all required details"})
        }
        console.log("in Create Event",req.body)
        const newEvent=new EventModel({
            organisedBy:userId,
            eventName,
            eventLocation,
            startDate:new Date(`${startDate}T${startTime}`),
            description,
            guests,
           eventMedia:{
            banner:bannerImg,
            trailer:eventTrailer
           },
           registrationFee:isNaN(parseInt(registrationFee))?0:parseInt(registrationFee)
            
        })

        const response=await newEvent.save()
        console.log("Event Created Successfully",response)
       return res.status(201).json({message:"Event Created Successfully"})
    }
    catch(err){
        console.error("error in createEvent.js",err.message)
       return res.status(500).json({message:"Internal Server Error! Event Creation Failed"})
    }

}

export default createEvent