import dotenv from "dotenv";
import nodemailer from 'nodemailer';

dotenv.config();


const transporter = nodemailer.createTransport({
    host: "sandbox.smtp.mailtrap.io",
    port: 2525,
    secure: false,
    auth: {
      user: process.env.MAIL_TRAP_USER,
      pass: process.env.MAIL_TRAP_PASSWORD
    }, 

  });

  const info = await transporter.sendMail({
    from: 'horodylova.sv@gmail.com',  
    to: "horodylova.sv@gmail.com",  
    subject: "Hello ✔", 
    text: "Hello world?",  
    html: "<b>Hello world?</b>",  
  });

  transporter.sendMail(info)
  .then(console.log)
  .catch(console.error);
