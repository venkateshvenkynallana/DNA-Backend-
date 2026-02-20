import mongoose from "mongoose";
import user from "./User.js";



const mediaSchema=new mongoose.Schema({
    banner:{
        type:String,
        required:false
    },
    trailer:{
        type:String,
        required:false
    }
},
{
    _id:false
})

const eventSchema= new mongoose.Schema({
        organisedBy:{
            type:mongoose.Schema.Types.ObjectId,
            ref:"Admin",
            required:true
        },
        eventName:{
            type:String,
            required:true
        },
        description:{
            type:String,
            required:true
        },
        eventLocation:{
            type:String,
            required:true
        },
        startDate:{
            type:Date,
            required:true
        },
        guests:{
            type:[String],
            default:[]
        },
        eventMedia:{
            type: mediaSchema
        },
        noOfAttendees:{
            type:Number,
            default:0
        },
        registrationFee:{
            type:Number,
            required:true
        }
    
    },
    {
        timestamps: true
    }
)


export const EventModel=mongoose.model("event",eventSchema)