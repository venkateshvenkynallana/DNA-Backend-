import mongoose from "mongoose";


const userSchema = new mongoose.Schema({
    email: {
        type: String,
        type: String,
        required: true,
        unique: true
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

    },
    designation: {
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


        education: {
            degree: { type: String, default: "" },
            university: { type: String, default: "" },
            year: { type: String, default: "" }
        },

        achievements: {
            achievementsName: { type: String, default: "" },
            issuingOrganization: { type: String, default: "" }
        },
        Interests: {
            type: [String],
            default: []
        },
        mediaUpload: [
            {
                type: { type: String }, // "video" | "image"
                url: { type: String },
                date: { type: String }
            }
        ]

    },
    //otp for reset password
    resetOtp: Number,


    otpExpire: Date,

}, { timestamps: true });

const user = mongoose.model("User", userSchema);

export default user;