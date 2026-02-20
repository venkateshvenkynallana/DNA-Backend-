import { v2 as cloudinary } from "cloudinary";


export async function uploadFile(filePath){
    // console.log("File path of uploadFile",filePath)
    const result=await cloudinary.uploader?.upload(filePath)
    console.log("Link of uploaded file",result)
    return result?.secure_url;

}