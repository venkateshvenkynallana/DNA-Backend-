import { uploadFile } from "../../helperFiles/uploadFile.js";
import { EventModel } from "../../models/event.js"


 async function updateEvent(req,res){

     try {
         const { id } = req.params
         const { eventName, eventLocation, startDate, startTime, 
            description, guests, banner, eventTrailer, registrationFee } = req.body;
        let bannerLink=null;
        console.log("body in update Event",req.body)
        if(banner){
            bannerLink=await uploadFile(banner)
        }
        const response = await EventModel.updateOne({
                                        _id: id
                                    },
                                        {
                                            $set: {
                                                eventName,
                                                eventLocation,
                                                startDate: new Date(`${startDate}T${startTime}`).toISOString(),
                                                description,
                                                guests,
                                                eventMedia: {
                                                    banner: bannerLink,
                                                    trailer: eventTrailer
                                                },
                                                registrationFee: isNaN(parseInt(registrationFee)) ? 0 : parseInt(registrationFee)

                                            }
                                        }
                                     
                                    )
        console.log("Event Details Updated",response)
        res.status(200).json({message:"Event Details Updated"})
     }
    catch(err){
        console.error("Error in updateEvent.js",err)
        return res.status(500).json({message:"Internal Server Error ! Updation Failed"})
    }

}


export default updateEvent