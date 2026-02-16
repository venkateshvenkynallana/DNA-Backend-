import mongoose from "mongoose";

const adminSchema = new mongoose.Schema(
    {
        fullName:{
            type: String,
            default: ""
        },
        email:{
            type: String,
            required: true,
            unique: true
        },
        emailHash:{
             type: String,
            required: true,
            unique: true
        },
        password: {
            type: String,
            required: true
        },
        role: {
            type: String,
            default: "admin"
        } 
    },{timestamps: true}
);

const Admin =  mongoose.model("Admin", adminSchema);

export default Admin;