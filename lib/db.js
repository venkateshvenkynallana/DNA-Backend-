import mongoose from "mongoose";

//function to connect to mongodb database
export const connectDB = async()=>{
    try {
        mongoose.connection.on('connected',()=>console.log('DataBase connected'));
        await mongoose.connect(`${process.env.MONGODB_URL}`);
        console.log("✅ MongoDB connected successfully");
  } catch (error) {
    console.error("❌ MongoDB connection failed:");
    console.error(error.message);
    process.exit(1);
  }
};