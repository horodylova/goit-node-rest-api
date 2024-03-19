import { config } from "dotenv";
import nodemailer from 'nodemailer';

config();

const { MAIL_TRAP_USER, MAIL_TRAP_PASSWORD } = process.env;

const transporter = nodemailer.createTransport({
    host: "smtp.mailtrap.io",
    port: 2525,
    auth: {
      user: MAIL_TRAP_USER,
      pass: MAIL_TRAP_PASSWORD
    }
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

