import jwt from "jsonwebtoken";
import User from "../models/User.js";
import Admin from "../models/Admin.js";

//verify  route

export const protectRoute = async(req, res, next) => {
    try {
        const authHeader = req.headers.authorization;
        console.log("header", authHeader);

        if(!authHeader || !authHeader.startsWith("Bearer ")) {
            return res.status(401).json({message: "Token not provided."});
        }

        const token = authHeader.split(" ")[1];

        if (!token || token === 'null' || token === 'undefined') {
            return res.status(401).json({ message: "Invalid token format." });
        }

        console.log("token", token);

        const decode = jwt.verify(token, process.env.JWT_SECRET);

        const user = await User.findById(decode.userId).select("-password");

        if (!user) return res.status(400).json({ message: "User not found." });

        req.user = user;
        next();

    } catch (error) {
        console.log("protect route error", error);
        res.status(401).json({ message: error.message });
    }
}

// admin-only routes
export const protectAdminRoute = async (req, res, next) => {
    try {
        const authHeader = req.headers.authorization;

        if (!authHeader || !authHeader.startsWith("Bearer ")) {
            return res.status(401).json({ message: "Token not provided." });
        }

        const token = authHeader.split(" ")[1];

        if (!token || token === 'null' || token === 'undefined') {
            return res.status(401).json({ message: "Invalid token format." });
        }

        const decode = jwt.verify(token, process.env.JWT_SECRET);

        // Look in Admin collection, not User
        const adminUser = await Admin.findById(decode.userId).select("-password");
        if (!adminUser) return res.status(404).json({ message: "Admin not found." });

        // check role
        if (adminUser.role !== "admin") {
            return res.status(403).json({ message: "Access denied. Admins only." });
        }

        req.user = adminUser;
        next();

    } catch (error) {
        console.log("protect admin route error", error);
        res.status(401).json({ message: error.message });
    }
};