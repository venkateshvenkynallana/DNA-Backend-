import bcrypt from "bcryptjs";
import Admin from "../models/Admin.js";
import { decodeToken, generateToken } from "../lib/utils.js";
import RoleModel from "../models/Roles.js";
import User from "../models/User.js";
import resend, { resendSetup } from "../lib/mailer.js";
// import user from "../models/User.js";
import { decrypt, encrypt, hashEmail } from "../lib/encrypt.js";
import mongoose from "mongoose";
import { getIO, onlineUsers } from "../lib/socket.js";
 
// create admin

export const adminRegister = async( req, res) =>{
    try {
        const {email, password, name} = req.body;

        if(!name || !email || !password) {
            return res.status(400).json({message: "All fields are required"});
        }

        const existingAdmin = await admin.findOne({ emailhash:hashEmail(email) });

        if(existingAdmin) {
            return res.status(400).json({message: "Admin already exists"});
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const newAdmin = await Admin.create({
            fullName:name,
            email:encrypt(email),
            emailHash:hashEmail(email),
            password: hashedPassword,
            role: "admin"
        });

        const token = generateToken(newAdmin._id);

       return res.status(201).json({
            success: true,
            adminData: {
                _id: newAdmin._id,
                name: newAdmin.fullName,
                email: newAdmin.email,
                role: newAdmin.role
            },
            token,
            message: "Admin registered successfully"
        });

    } catch (error) {
        console.log("Admin registration error", error);
       return res.status(500).json({message: "Internal server error"});
    }
}


export const adminLogin = async (req, res) => {
    try{
        const { email, password } = req?.body;


        if(!email || !password) {
            return res.status(400).json({message: "All fields are required"});
        }


        //find admin
        const AdminMail = await Admin.findOne({emailHash:hashEmail(email)});

        if(!AdminMail) {
            return res.status(404).json({success:false,message: "Admin not found"});
        }

        //compare password
        const isPasswordMatch =  await bcrypt.compare(password, AdminMail.password);

        if(!isPasswordMatch) {
            return res.status(401).json({success:false,message: "Invalid credentials"});
        }

        //generate token

        const token = generateToken(AdminMail);

        res.status(200).json({
            success: true,
            token,
            message: "Admin logged in successful."
        });
    } catch (error) {
        console.log("admin login error", error);
        res.status(500).json({ message: "Internal server error"});
    }
}

export async function getHomePageData(req,res){
    try{
        const{userId}=decodeToken(req)
    //    console.log("user id in getHomePageData",userId)
            const user=await Admin?.findById(userId)?.populate("role")
            // console.log("user in getHomePgae",user)
            const accessList=user?.role?.access

            const members=await User?.find({});
            const adminsCreated=await Admin?.find({createdBy:userId})
            // console.log("accessList",accessList)
            
            const membersCreated=members?.filter(mem=>mem.createdBy===userId)
            const noOfMemCreated=membersCreated?.length
            res.status(200).json({message:"Success",data:{
               accessList ,membersCount:(members?.length-noOfMemCreated),usersCount:(adminsCreated?.length+noOfMemCreated)
            }})
    }
    catch (error) {
        console.log("admin login error", error);
        res.status(500).json({ message: "Internal server error"});
    }
}

export async function addUser(req,res){
    try{
        const { fullName, email, password, bio, phoneNo,roleId,dashboardAccess } = req.body;

        const{userId}=decodeToken(req)

        if (!fullName || !email || !password || !phoneNo ||!roleId||!dashboardAccess) {
            return res.status(400).json({ message: "fields are missing." });
        }

       

//password hashing
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);
        
        let newUser
        const userData={
            fullName,
            email:encrypt(email),
            emailHash:hashEmail(email),
            password: hashedPassword,
            phoneNo:encrypt(phoneNo),
            phoneHash:hashEmail(phoneNo),
            role:roleId,
            paymentStatus:"special",
            createdBy:userId
        }

        

        if(dashboardAccess==="admin"){

            const user = await Admin.findOne({ $or: [{ emailhash: hashEmail(email) }, { phoneHash: hashEmail(phoneNo) }] });
            if (user) {
                return res.status(409).json({ message: "User already exists." });
            }
            newUser=await Admin.create(userData)

        }
        else if(dashboardAccess==="member"){
        
            const user = await User.findOne({ $or:[{emailhash:hashEmail(email)},{phoneHash:hashEmail(phoneNo)}] });
            if (user) {
                return res.status(409).json({ message: "User already exists." });
            }
            newUser = await User.create(userData);
        }
        else{
            return res.status(400).json({message:"dashBoardAccess is required"})
        }

        // mail sending logic 
        const mailSend = {

            to: email,
            subject: "🎉 Welcome to DNA – Your Account is Ready!",
            html: `
                <div style="font-family: Arial, sans-serif; background-color: #f4f6f8; padding: 30px;">
                    <div style="max-width: 600px; margin: auto; background: #ffffff; padding: 30px; border-radius: 8px; box-shadow: 0 4px 10px rgba(0,0,0,0.05);">
                        
                        <h2 style="color: #2c3e50; margin-bottom: 10px;">
                            Welcome to DNA, ${newUser.fullName}! 🎉
                        </h2>
                        
                        <p style="font-size: 15px; color: #555;">
                            We're excited to have you on board. Your account has been successfully created.
                        </p>

                        <p style="font-size: 15px; color: #555;">
                            You can now log in and start exploring all the features available to you.
                        </p>

                        <div style="text-align: center; margin: 30px 0;">
                            <a href="https://dna-frontend-eosin.vercel.app/landing?isLogin=true" 
                            style="background-color: #4CAF50; color: #ffffff; padding: 12px 25px; text-decoration: none; border-radius: 5px; font-size: 14px;">
                            Login to Your Account
                            </a>
                        </div>

                        <hr style="margin: 20px 0;" />

                        <p style="font-size: 14px; color: #888;">
                            If you didn't create this account, please report it immediately.
                        </p>

                        <div style="text-align: center; margin-top: 15px;">
                            <a href="https://yourwebsite.com/api/report-account/${newUser._id}" 
                            style="background-color: #e74c3c; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px;">
                            🚨 Report This Account
                            </a>
                        </div>

                        <hr style="border: none; border-top: 1px solid #eee; margin: 25px 0;" />

                        <p style="font-size: 13px; color: #999;">
                            © ${new Date().getFullYear()} DNA. All rights reserved.
                        </p>

                    </div>
                </div>
            `
        }


        const response = await resendSetup().emails?.send({
            from: "dna-support@dna.hi9.in",
            to: email,
            subject: mailSend.subject,
            html: mailSend.html
        });

        console.log("mail sending repsonse in addUser",response)

        const token = generateToken(newUser);

        res.status(200).json({ success: true, message: "Account created successfully." });

    } catch (error) {
        console.log("error in addUser", error);
        return res.status(500).json({ message: "Internal server error." });
    }
    
}

export async function getAllUsersByAdmin(req,res){
    try{
        const {userId}=decodeToken(req)
        const allUsers=await User.find({createdBy:userId}).populate("role")
        const allAdmins=await Admin.find({createdBy:userId}).populate("role")
        // console.log("all users in getAllUsersByAdmin",allUsers)
        const decryptedUsers=allUsers.map(user=>({
            ...user.toObject(),
            email:decrypt(user?.email),
            phoneNo:decrypt(user?.phoneNo),
            
        }))
        const decryptedAdmins=allAdmins.map(admin=>({
            ...admin.toObject(),
            email:decrypt(admin?.email),
            phoneNo:decrypt(admin?.phoneNo)
        }))
        return res.status(200).json({message:"Data fetched Sucefully",data:[...decryptedUsers,...decryptedAdmins]})

    }
    catch(error){
        console.log("Error in getAllUsersByAdmin",error)
        return res.status(500).json({message:"Internal Server Errro"})
    }
}

export async function updateUser(req,res){
    try{
        const {userId}=decodeToken(req);
        const {id, fullName, email, password, bio, phoneNo,roleId,dashboardAccess } = req.body;
         const userData={
            fullName,
            email:encrypt(email),
            emailHash:hashEmail(email),
            phoneNo:encrypt(phoneNo),
            phoneHash:hashEmail(phoneNo),
            role:roleId
        }
        console.log("usersData in updateUser",userData)
        const response=await User.updateOne({_id:id},{
            $set:userData
        })
        let admResponse
        if(response.matchedCount===0){
             admResponse=await Admin.updateOne({_id:id},{
           $set: userData
        })        }
       
        if(response.matchedCount===0 && admResponse.matchedCount===0){
            return res.status(404).json({message:"User Not found"})
        }
        console.log("respnseesss",response,admResponse)

        return res.status(200).json({message:"User role updated Updated!"})
    }
    catch(err){
        console.log("Error in updateUser",err.message)
        return res.status(500).json({message:"Internal server Error"})
    }
}

export async function updateMemberRole(req,res){
    try{
        const {userId}=decodeToken(req);
        const{id,roleId}=req.body
        const response=await User.updateOne({_id:id},{
            role:roleId
        })
        if(!(response.matchedCount)){
            return res.status(404).json({message:"User Not found"})
        }

        return res.status(200).json({message:"User role updated Updated!"})
    }
    catch(err){
        console.log("Error in updateMemberRole",err.message)
        return res.status(500).json({message:"Internal server Error"})
    }
}

//delete users admins controller
export const deleteUser = async (req, res) => {
    try {
        const {id} = req.params
        console.log("id in delete user", id)
        if(!id){
            return res.status(400).json({message: "User Id is Not present"})
        }

        const response = await User.deleteOne({
            _id: id
        })


        let admResponse
        if(!(response.matchedCount)){
         admResponse=await Admin.deleteOne({_id:id}) 
        }
       
        if(response.matchedCount===0 && admResponse.matchedCount===0){
            return res.status(404).json({message:"User Not found"})
        }

        // console.log("response in delete user", response);

        return res.status(200).json({message: "User Deleted!"})

    } catch (error) {
        console.log("Error in delete user controller", error);
        return res.status(500).json({message: "Internal Server Error"});
    }
}

// export async function deleteUserRole(req,res){
//     try{
//         const {userId}=decodeToken(req);
//         const{id,roleId}=req.body
//         const response=await user.deleteOne({_id:id},{
//             role:roleId
//         })
//         if(!response.deletedCount){
//             return res.status(404).json({message:"User Not found"})
//         }

//         return res.status(200).json({message:"User Updated!"})

//     }
//     catch(err){
//         console.log("Error in deleteUser",err.message)
//         return res.status(500).json({message:"Internal server Error"})
//     }
// }
export const blockUser = async( req, res) => {
    try {
        const {id} = req.params;

        if(!id){
            return res.status(400).json({message: "User Id wrong"})
        }

        const user = await User.findById(id);

        if(!user){
            return res.status(404).json({message : "User not found"})
        }

        user.status = user.status === "verified" ? "blocked" : "verified";

        await user.save();

        res.status(200).json({message: `User has been ${user.status === "verified" ? "unblocked" : "blocked"} successfully`})

    } catch (error) {
        console.log("Error in blockUser.js", error.message);
        res.status(500).json({message: "Internal Server Error! unable to block user"})
    }
}

// Routes of Role

export async function getRoles(req,res){
    try{
        const{userId}=decodeToken(req);
        const roles=await RoleModel.find({
            createdBy:{ $in:[userId,null]},
            roleName:{$nin:["superadmin"]}
        })
        // console.log({roles})
        // const repsonse=await RoleModel.updateMany({},{
        //     $set:{
        //         createdBy:null
        //     }
        // })
        // console.log("responseee in getRoless",repsonse)
        return res.status(200).json({message:"Roles Fetch Successfull",data:roles})
    }
    catch(err){
        console.log("Error in GetRoles",err);
        return res.status(500).json({message:"Internal server Error"})
    }
}

export async function getOneRole(req,res){
    try{
        // const {userId}=decodeToken(req);
        const{id}=req.params
        // console.log("id in getOneRole",id)
        const roleFound=await RoleModel.findById(id)
        if(!roleFound){
            return res.status(400).json({message:"Role Not Found"})
        }
        return res.status(200).json({message:"Role Found",data:roleFound})
    }
    catch(err){
        console.log("Error in GetOneRole",err);
        return res.status(500).json({message:"Internal server Error"})

    }
}

export async function addRole(req,res){
    try{
        const{userId}=decodeToken(req)
        const{role,access,description}=req.body
        if(!role||!access){
            return res.status(400).json({message:"Please Enter all required Details"})
        }
        const existingRole=await RoleModel.find({
            roleName:role?.toLowerCase()?.trim(),
            createdBy:userId
        })
        console.log({role,existingRole})
        if(existingRole.length>0){
            return res.status(409).json({message:"Role already exists!"})
        }
        const response=await RoleModel.insertOne({
            roleName:role,access,createdBy:userId,description
        })

        console.log("Role is Added",response)
        return res.status(200).json({message:"Role Added Succesfully"})
    }
    catch(err){
        console.log("Error in addRole", err.message);
        return res.status(500).json({ message: "Internal server error." });
 
    }
}


export async function updateRole(req,res){
    try{
        const {userId}=decodeToken(req);
        const{roleId}=req.params
        const{roleName,access}=req.body;
        const response=await RoleModel.updateOne({
            _id:roleId
        },{
            roleName,
            access
        })
        if(!response.matchedCount){
            return res.status(404).json({message:"Role Not found"})
        }
        // const io=getIO()
        // const socketId=onlineUsers.get()
        // io.to()

        return res.status(200).json({message:"Role Updated!"})
    }
    catch(err){
        console.log("Error in updateRole",err.message)
        return res.status(500).json({message:"Internal server Error"})
    }
}

export async function deleteRole(req,res){
    try{
        const {userId}=decodeToken(req);
        const{roleId}=req.params;
        
        const session=await mongoose.startSession()

        const defaultRoleIds=["69906336f94bb4961368eafd","699817875af680520f78ab7a"]
        
        if(defaultRoleIds.includes(roleId)){
            return res.status(400).json({message:"This Role Is Default You cant delete it"})    
            
        }
        const response=await RoleModel.deleteOne({
            _id: new mongoose.Types.ObjectId(roleId),
            createdBy:new mongoose.Types.ObjectId(userId)
        },{session})

// console.log("Searching for Role ID:", roleId, "Type:", typeof roleId);

        const updRes=await User.updateMany({role:new mongoose.Types.ObjectId(roleId)},{
            $set:{
                role:null
            }
        },{session})
        console.log("updates response in deleteRole",updRes)
        if(!response.deletedCount){
            return res.status(404).json({message:"Role Not found"})
        }

        return res.status(200).json({message:"Role Deleted!"})
    
    }
    catch(err){
        console.log("Error in deleteRole",err.message)
        return res.status(500).json({message:"Internal server Error"})
    }
}