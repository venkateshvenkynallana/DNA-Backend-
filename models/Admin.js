import mongoose from "mongoose";

const adminSchema = new mongoose.Schema(
    {
        name:{
            type: String,
            default: ""
        },
        email:{
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

const admin =  mongoose.model("Admin", adminSchema);

export default admin;