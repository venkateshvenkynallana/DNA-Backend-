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
            type: mongoose.Schema.Types.ObjectId,
            default: "69906326f94bb4961368eaf9",
            ref:"role"
        } 
    },{timestamps: true}
);

const Admin =  mongoose.model("Admin", adminSchema);

export default Admin;