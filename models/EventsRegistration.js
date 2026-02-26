import mongoose, { model } from "mongoose";



const registrationSchema=new  mongoose.Schema({
    _id:{
        type:String,
        required:true,
        unique:true,
    },
    memberId:{
        type:String,
        required:true,
        ref:"users"
    },
    eventId:{
        type:String,
        required:true,
        ref:"events"
    },
    organiserId:{
        type:String,
        required:true,
        ref:"admins"
    }

})

export const RegistrationModel= mongoose.model("registration",registrationSchema)