import jwt from "jsonwebtoken";
import User from "../models/User.js";
import { decodeToken } from "../lib/utils.js";
import Admin from "../models/Admin.js";

//verify  route

export const protectUserRoute = async(req, res, next) => {
    try {
        const{userId}=await decodeToken(req)??{userId:null}
        // console.log("userId in protectedROute",userId)
        if(!userId){
            return res.status(401).json({message:"Please Login again!"})
        }
        req.userId = userId;
        const user =  await User.findById(userId).select("-password");
        if(!user ) return res.status(404).json({message: "User not found."});

        // req.user = user;
        next();

    } catch (error) {

        console.error("protect route error", error.message);
        if(error.message==="jwt expired"){
            return res.status(401).json({ message: "Session Expired"}); 
        }
        return res.status(401).json({ message: "Internal Server Error"});
    }
}
