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

// admin-only routes
export const protectAdminRoute = async (req, res, next) => {
    try {        
        
        const{userId}=await decodeToken(req)??{userId:null}
         if(!userId){
            return res.status(401).json({message:"Please Login again!"})
        }
        // console.log("userId in protect admin route",userId)
        // Look in Admin collection, not User
        const adminUser = await Admin.findById(userId).select("-password");
        if (!adminUser) return res.status(404).json({ message: "Admin not found." });
        // console.log("adminUser in adminPRotectroute",adminUser)

        // req.user = adminUser;
        next();

    } catch (error) {
        if (error.name === 'TokenExpiredError') {
      return res.status(401).json({ error: 'Token expired' });
    }
        console.log("protect admin route error", error.message);
        res.status(403).json({ message:"Invalid Token" });
    }
};