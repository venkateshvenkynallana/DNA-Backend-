import { EventModel } from "../../models/event.js"


async function deleteEvent(req,res){
    try{
        const {id} = req?.params
        console.log("id in delete Event", id)
        if(!id){
            return res.status(400).json({message:"event Id is Not present"})
        }
        const response=await EventModel.deleteOne({
            _id:id
        })
        console.log("response in delete Event",response)
        return res.status(200).json({message:"Event Deleted!"})


    }
    catch(err){
        console.log("Error in Delete Event.js",err.message)
        return res.status(500).json({message:"Internal Server Error! unable to delete Event"})
    }
}


export default deleteEvent