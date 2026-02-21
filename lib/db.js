import mongoose from "mongoose";
import User from "../models/User.js";
import { decrypt, encrypt, hashEmail } from "./encrypt.js";
import Admin from "../models/Admin.js";
import Connections from "../models/Connection.js";

//function to connect to mongodb database
export const connectDB = async()=>{
    try {
        mongoose.connection.on('connected',()=>console.log('DataBase connected'));
        if(!process.env.MONGODB_URL){
          console.log("Mongo Db String not found")
         process.exit(1);
        }
        await mongoose.connect(`${process.env.MONGODB_URL}`);
        console.log("✅ MongoDB connected successfully");
  } catch (error) {
    console.error("❌ MongoDB connection failed:");
    console.error(error.message);
    process.exit(1);
  }
};


export  const updateFields=async ()=>{
  const users=await User.find()
  // const users=await Admin.find()
  console.log("Users in updatefields",users)
  const bulkOps=users?.map(user=>(
    {  
      updateOne:{
        filter:{},
        update:{
          // $set:{
          //   email:encrypt(user.email),
          //   emailHash:hashEmail(user.email)
          // }
          // $rename:{
          //   "receiver":"reciever",
          //   "receiverFullName":"recieverFullName",
          //   "receiverProfilePic":"recieverProfilePic",
          //   "receiverDesignation":"recieverDesignation"
          // }
        }
      }
    }
  ))
  // const result=await Connections.updateMany({},{ $rename:{
  //           "receiver":"reciever",
  //           "receiverFullName":"recieverFullName",
  //           "receiverProfilePic":"recieverProfilePic",
  //           "receiverDesignation":"recieverDesignation"
  //         }})
  // const result=await Admin.bulkWrite(bulkOps)
  console.log("Result in updatefieldss",result)
}