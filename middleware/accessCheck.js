import { decodeToken } from "../lib/utils.js"
import Admin from "../models/Admin.js"
import user from "../models/User.js"


export  function accessCheck(permission){
    return async(req,res,next)=>{
        console.log({permission})
        const{userId}=decodeToken(req)
        try{
            const roleDetails=await user?.findById(userId)?.populate("role")
            console.log("roleDetails",roleDetails)
            const hasPermission=()=>{
                const roleAccess=roleDetails?.role?.access
                console.log({roleAccess})
                req.roleAccess=roleAccess
                if(roleAccess?.includes("*")||roleAccess?.includes(permission)){
                    return true
                }
                return false
            }
            console.log("hasPermission",hasPermission())
            if(!hasPermission()){
                return res.status(403).json({message:"You Are not authorised"})
            }
            next()

        }
        catch(err){
            console.log("Error in access Check",err.message)
            return res.status(500).json({message:"Internal Server Error"})
        }
    }
}


export  function adminAccessCheck(permission){
    return async(req,res,next)=>{
        console.log({permission})
        const{userId}=decodeToken(req)
        try{
            console.log("uder id in admin Accesscheck",userId)
            const roleDetails=await Admin?.findById(userId)?.populate("role")
            console.log("roleDetails",roleDetails)
            const hasPermission=()=>{
                const roleAccess=roleDetails?.role?.access
                req.roleAccess=roleAccess
                console.log({roleAccess})
                if(roleAccess?.includes("*")||roleAccess?.includes(permission)){
                    return true
                }
                return false
            }
            console.log("hasPermission",hasPermission())
            if(!hasPermission()){
                return res.status(403).json({message:"You Are not authorised"})
            }
            next()

        }
        catch(err){
            console.log("Error in access Check",err.message)
            return res.status(500).json({message:"Internal Server Error"})
        }
    }
}


