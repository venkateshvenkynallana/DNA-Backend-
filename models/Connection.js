import mongoose from "mongoose";

const connectionSchema = new mongoose.Schema({
    _id:{
        type: String,
        required: true
    },
    sender : {
        type : mongoose.Schema.Types.ObjectId,
        ref: "User",
        required : true
    },
    senderFullName : {
        type : String,
        required : true
    },
    senderProfilePic : {
        type : String
    },
    senderDesignation : {
        type: String,
        required : true
    },

    receiver : {
        type : mongoose.Schema.Types.ObjectId,
        ref: "User",
        required : true
    },
    receiverFullName : {
        type : String,
        required : true
    },
    receiverProfilePic : {
        type : String
    },
    receiverDesignation : {
        type : String,
        required : true
    },


    status : {
        type : String,
        enum : ["pending", "accepted", "rejected"],
        default : "pending"
    },

    deleteAfter : {
        type: Date,
        index: { expireAfterSeconds: 0}
    }
}, { timestamps : true},{_id : false});

connectionSchema.index({ sender:1, receiver:1 }, { unique: true });
const Connections = mongoose.model("Connections", connectionSchema);

export default Connections;