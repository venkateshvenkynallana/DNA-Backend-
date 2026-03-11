import mongoose from "mongoose";

const likeSchema = new mongoose.Schema({
    _id:{
        type: String,
        required: true
    },
    likedBy:{
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },

    likedTo:{
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },

}, { timestamps: true});

const Like = new mongoose.model("like", likeSchema);

export default Like;