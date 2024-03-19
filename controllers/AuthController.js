import dotenv from 'dotenv';
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import UserModel from "../models/userModel.js";
import HttpError from "../helpers/HttpError.js";
import nodemailer from 'nodemailer';
import { v4 as uuidv4 } from 'uuid';


dotenv.config();

const transporter = nodemailer.createTransport({
  host: "smtp.mailtrap.io",
  port: 2525,
  auth: {
    user: process.env.MAIL_TRAP_USER,
    pass: process.env.MAIL_TRAP_PASSWORD
  }
});

const register = async (req, res, next) => {
  try {
    const { password, email, subscription } = req.body;

    if (!email || !password) {
      throw HttpError(400, "Email and password are required");
    }

    const existingUser = await UserModel.findOne({ email });
    if (existingUser) {
      throw HttpError(409, "Email in use");
    }

    const verificationToken = uuidv4();

    const hashedPassword = await bcrypt.hash(password, 10);

    await transporter.sendMail({
      from: 'horodylova.sv@gmail.com',  
      to: email,  
      subject: "Welcome ✔", 
      text: `Hello new customer, please verify your email by clicking the following link: http://localhost:3000/users/verify/${verificationToken}`,  
      html: `<b>Welcome to our website. To confirm your registration, please click on the following link: <a href="http://localhost:3000/users/verify/${verificationToken}">Verify Email</a></b>`,  
    });

   

    const newUser = await UserModel.create({
      email,
      password: hashedPassword,
      subscription,
      token: null,
      avatarURL: null,
      verify: false,
      verificationToken,
    });

    await newUser.save();

    res.status(201).json({
      user: {
        email: newUser.email,
        subscription: newUser.subscription,
        avatarURL: newUser.avatarURL,
        verificationToken: newUser.verificationToken,
      },
    });
  } catch (error) {
    next(error);
  }
};

const verifyEmail = async (req, res, next) => {
  try {
    const { verificationToken } = req.params;
    const user = await UserModel.findOne({ verificationToken });

    if (!user) {
      throw HttpError(404, 'User not found');
    }

    user.verify = true;
    await user.save();

    res.status(200).json({ message: 'Verification successful' });
  } catch (error) {
    next(error);
  }
};


const resendVerificationEmail = async (req, res, next) => {
  try {
    const { email } = req.body;

    if (!email) {
      throw HttpError(400, "Missing required field email" );
    }

    const user = await UserModel.findOne({ email });

    if (!user) {
      throw HttpError(400, "User not found");
    }

    if (user.verify) {
      throw HttpError(400,"Verification has already been passed");
    }

    const verificationToken = user.verificationToken;
    await transporter.sendMail({
      from: 'horodylova.sv@gmail.com',
      to: email,
      subject: "Welcome back! Please verify your email",
      text: `Welcome back! Please click on the following link to verify your email: http://localhost:3000/users/verify/${verificationToken}`,
      html: `<b>Welcome back! Please click on the following link to verify your email: <a href="http://localhost:3000/users/verify/${verificationToken}">Verify Email</a></b>`,
    });

    res.status(200).json({ message: "Verification email sent" });
  } catch (error) {
    next(error);
  }
};



const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      throw HttpError(400, "Email and password are required");
    }

    const user = await UserModel.findOne({ email });
    if (!user) {
      throw HttpError(401, "Email or password is wrong");
    }

    const passwordMatch = await bcrypt.compare(password, user.password);
    if (!passwordMatch) {
      throw HttpError(401, "Email or password is wrong");
    }

    const token = jwt.sign(
      {
        id: user._id,
      },
      process.env.JWT_SECRET
    );

    user.token = token;
    await user.save();

    res.status(200).json({
      token,
      user: {
        email: user.email,
        subscription: user.subscription,
      },
    });
  } catch (error) {
    next(error);
  }
};

const logout = async (req, res, next) => {
  try {
    const userId = req.user.id;

    const user = await UserModel.findById(userId);
    if (!user) {
      throw HttpError(401, 'User not found');
    }

    user.token = null;
    await user.save();

    res.status(204).json({ message: 'Logout successful' });
  } catch (error) {
    next(error);
  }
};

const getCurrentUser = async (req, res, next) => {
  try {
    const { email, subscription } = req.user;

    res.status(200).json({ email, subscription });
  } catch (error) {
    next(error);
  }
};

const uploadAvatar = async (req, res, next) => {
  try {
    if (!req.file) {
      throw HttpError(400, 'No file uploaded');
    }

    const userId = req.user.id;
    const avatarURL = req.file.filename;

    const user = await UserModel.findByIdAndUpdate(
      userId,
      { avatarURL },
      { new: true }
    );

    if (!user) {
      throw HttpError(401, 'Not authorized');
    }

    res.status(200).json({ avatarURL });
  } catch (error) {
    next(error);
  }
};

export default { register, verifyEmail, login, logout, getCurrentUser, uploadAvatar, resendVerificationEmail };
