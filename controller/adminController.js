import bcrypt from "bcryptjs";
import admin from "../models/Admin.js";
import { generateToken } from "../lib/utils.js";

// create admin

export const adminRegister = async( req, res) =>{
    try {
        const {email, password, name} = req.body;

        if(!name || !email || !password) {
            return res.status(400).json({message: "All fields are required"});
        }

        const existingAdmin = await admin.findOne({ email });

        if(existingAdmin) {
            return res.status(400).json({message: "Admin already exists"});
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const newAdmin = await admin.create({
            name,
            email,
            password: hashedPassword,
            role: "admin"
        });

        const token = generateToken(newAdmin._id);

        res.status(201).json({
            success: true,
            adminData: {
                _id: newAdmin._id,
                name: newAdmin.name,
                email: newAdmin.email,
                role: newAdmin.role
            },
            token,
            message: "Admin registered successfully"
        });

    } catch (error) {
        console.log("Admin registration error", error);
        res.status(500).json({message: "Internal server error"});
    }
}


export const adminLogin = async (req, res) => {
    try{
        const { email, password } = req.body;

        //find admin
        const AdminMail = await admin.findOne({email});

        if(!AdminMail) {
            return res.status(404).json({message: "Admin not found"});
        }

        //compare password
        const isPasswordMatch =  await bcrypt.compare(password, AdminMail.password);

        if(!isPasswordMatch) {
            return res.status(401).json({message: "Invalid credentials"});
        }

        //generate token

        const token = generateToken(AdminMail._id);

        res.status(200).json({
            success: true,
            adminData:{
                _id: AdminMail._id,
                name:AdminMail.name,
                email: AdminMail.email,
                role: AdminMail.role,
            },
            token,
            message: "Admin logged in successful."
        });
    } catch (error) {
        console.log("admin login error", error);
        res.status(500).json({ message: "Internal server error"});
    }
}