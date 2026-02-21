import mongoose from "mongoose";


const notifySchema=new mongoose.Schema({
    notificationType:{
        type:String,
        required:true
    },
    notificationMessage:{
        type:String,
        required:true
    },
    notificationBy:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"users",
        required:true
    },
    notificationTo:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"users",
        required:true
    }

},{timestamps:true})


export const Notification=mongoose.model("notifications",notifySchema)