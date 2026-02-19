import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true,
        unique: true
    },
    emailHash:{
        type:String,
        required:true,
        unique:true
    },
    fullName: {
        type: String,
        required: true,
    },
    password: {
        type: String,
        required: true,
    },
    profilepic: {
        type: String,
        default: ""
    },
    bio: {
        type: String,
        default: ""
    },
    phoneNo: {
        type: String,
        required: true,
        unique: true,

    },
    phoneHash:{
        type:String,
        required:true,
        unique:true
    },
    designation: {
        type: String,
        default: ""
    },
    hospitalName: {
        type: String,
        default: ""
    },

    profile: {
        yearsOfExperience: {
            type: String,
            default: ""
        },
        // skills: {
        //     type: [String],
        //     default: []
        // },
        introVideo: {
            type: String,
            default: ""
        },

        experience: [
            {
                jobTitle: { type: String, default: "" },
                hospital: { type: String, default: "" },
                from: { type: String, default: "" },
                to: { type: String, default: "" }
            }
        ],


        education: [
            {
                degree: { type: String, default: "" },
                university: { type: String, default: "" },
                year: { type: String, default: "" }
            }
        ],


        achievements: [
            {
                achievementsName: { type: String, default: "" },
                issuingOrganization: { type: String, default: "" },
                achievementsImages: { type: String, default: "" }
            }
        ],

        // Interests: {
        //     type: [String],
        //     default: []
        // },
        mediaUpload: [
            {
                type: { type: String }, // "video" | "image"
                url: { type: String },
                date: { type: String }
            }
        ]

    },
    role:{
        type:mongoose.Schema.Types.ObjectId,
        required:true,
        default:null,
        ref:"role"
    },
    createdBy:{
        type:mongoose.Schema.Types.ObjectId,
        default:null,
        ref:"admin"
    },
    paymentRefId:{
        type:String,
        default:null
    },
    paymentRefImg:{
        type:String,
        default:null
    },
    //otp for reset password
    resetOtp: Number,


    otpExpire: Date,

    status:{
        type: String,
        enum: ["verified", "pending", "blocked"],
        default: "pending",
        required: true
    }

}, { timestamps: true });

const User = mongoose.model("User", userSchema);

export default User;