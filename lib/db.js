import mongoose from "mongoose";
import User from "../models/User.js";
import { encrypt, hashEmail } from "./encrypt.js";

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
  // console.log("Users in updatefields",users)
  const bulkOps=users?.map(user=>(
    {
      updateOne:{
        filter:{_id:user._id},
        update:{
          $set:{
            role:"69906336f94bb4961368eafd"
          }
        }
      }
    }
  ))
  const result=await User.bulkWrite(bulkOps)
  console.log("Result in updatefieldss",result)
}