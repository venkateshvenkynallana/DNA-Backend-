import { Resend } from "resend";



export const resendSetup=()=>{
    const resend = new Resend(process.env.RESEND_API_KEY);
// console.log("RESEND KEY:", process.env.RESEND_API_KEY);
return resend

}

export default resendSetup;