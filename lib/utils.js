import jwt from "jsonwebtoken";

//function to generate token
export const generateToken = (user) => {
    const{_id,fullName}=user
    const token = jwt.sign({fullName,userId:_id}, process.env.JWT_SECRET,{ expiresIn:"6h" });
    return token;
}

export  const decodeToken=(req,res)=>{
    const authHeader=req.cookies
// console.log("SECRET:", process.env.JWT_SECRET);

    if (req.method === "OPTIONS") {
        return next();
    }

    if(!authHeader) {
        return null;
    }
    const token=authHeader.loginToken
        console.log("token",token)
    if(!token){
        return null
    }

    const userData=jwt.verify(token,process.env.JWT_SECRET)
    console.log("user data in decode token",userData)
    return userData;
    

}