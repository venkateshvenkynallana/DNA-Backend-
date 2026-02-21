import { uploadFile } from "../../helperFiles/uploadFile.js";
import { EventModel } from "../../models/event.js"


 async function updateEvent(req,res){

     try {
         const { id } = req.params
         const { eventName, eventLocation, startDate, startTime, 
            description, guests, banner, trailer, registrationFee } = req.body;
        console.log("trailer in updatevent",trailer)
        if(!id){
            return res.status(400).json({message:"Please Select the appropriate Event"})
        }
        let bannerLink=banner;
        // console.log("body in update Event",req.body)
        if(!banner.includes("res.cloudinary.com")){
            bannerLink=await uploadFile(banner)
        }
        const response = await EventModel.updateOne({
                                        _id: id
                                    },
                                        {
                                            $set: {
                                                eventName,
                                                eventLocation,
                                                // startDate: new Date(`${startDate}T${startTime}`)?.toISOString(),
                                                description,
                                                guests,
                                                eventMedia: {
                                                    banner: bannerLink,
                                                    trailer: trailer
                                                },
                                                registrationFee: isNaN(parseInt(registrationFee)) ? 0 : parseInt(registrationFee)

                                            }
                                        }
                                     
                                    )
        if(response.matchedCount===0){
            return res.status(404).json({message:"Event Not Found"})
        }
        console.log("Event Details Updated",response)
        res.status(200).json({message:"Event Details Updated"})
     }
    catch(err){
        console.error("Error in updateEvent.js",err)
        return res.status(500).json({message:"Internal Server Error ! Updation Failed"})
    }

}


export default updateEvent