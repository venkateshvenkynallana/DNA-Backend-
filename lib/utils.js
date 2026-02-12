import jwt from "jsonwebtoken";

//function to generate token
export const generateToken = (user) => {
    const{_id,fullName}=user
    const token = jwt.sign({fullName,userId:_id}, process.env.JWT_SECRET,{ expiresIn: "1d" });
    return token;
}

export  const decodeToken=(req,res)=>{
    const authHeader=req.headers.authorization
console.log("SECRET:", process.env.JWT_SECRET);

    if (req.method === "OPTIONS") {
        return next();
    }

    if(!authHeader || !authHeader.startsWith("Bearer ")) {
            return null
    }
    const token=authHeader.split(" ")[1]
    const userData=jwt.verify(token,process.env.JWT_SECRET)
    console.log("token",token)

    return userData;
    

}