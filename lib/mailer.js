import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: Number(process.env.SMTP_PORT),
  secure: process.env.SMTP_PORT === "465", // true for 465, false for 587
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS
  }
});

// optional but powerful check
transporter.verify((err, success) => {
  if (err) {
    console.error("SMTP ERROR:", err);
  } else {
    console.log("SMTP READY");
  }
});

export default transporter;
