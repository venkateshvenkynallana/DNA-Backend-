import mongoose, { Schema } from "mongoose";


const schema=new Schema({
    roleName:{
        type:String,
        required:true,
        unique:true
    },
    createdBy:{
        type:String,
        required:true
    },
    access:[String]
},{timestamps:true})

const RoleModel=new mongoose.model("role",schema)

export default RoleModel;