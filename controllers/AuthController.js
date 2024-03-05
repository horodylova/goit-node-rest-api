import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import UserModel from "../models/userModel.js";
import HttpError from '../helpers/HttpError.js'; 
import dotenv from 'dotenv';
dotenv.config();

async function register(req, res, next) {
  try {
    const { password, email, subscription, token } = req.body;

    const normalizedEmail = email.toLowerCase();

    const existingUser = await UserModel.findOne({ email: normalizedEmail });
    if (existingUser) {
      throw new HttpError(409, 'User with this email already exists'); 
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await UserModel.create({
      password: hashedPassword,
      email: normalizedEmail,
      subscription,
      token
    });

    console.log(newUser);

    res.status(201).json(newUser);
  } catch (error) {
    next(error); 
  }
}

async function login(req, res, next) {
  try {
    const { email, password } = req.body;
    if (!email) {
      throw new HttpError(400, "Email is required"); 
    }

    const normalizedEmail = email.toLowerCase();

    const user = await UserModel.findOne({ email: normalizedEmail });
    if (!user) {
      throw new HttpError(401, "Email or password incorrect"); 
    }

    const passwordMatch = await bcrypt.compare(password, user.password);
    if (!passwordMatch) {
      throw new HttpError(401, "Email or password incorrect"); 
    }

    const token = jwt.sign({
      id: user._id
    }, process.env.JWT_TOKEN);

    await UserModel.findByIdAndUpdate(user._id, {token});

    res.send({ token });
  } catch (error) {
    console.error("Error during login:", error);
    next(error);
  }
};

async function logout(req, res, next) {
  try {
    const userId = req.user.id;

    await UserModel.findByIdAndUpdate(userId, { token: null });

    res.status(200).send({ message: "Logout successful" });
  } catch (error) {
    console.error("Error during logout:", error);
    next(error);
  }
}

const getCurrentUser = async (req, res, next) => {
  try {
    const { email, subscription } = req.user;
    res.status(200).json({ email, subscription });
  } catch (error) {
    next(error);
  }
};

export default { register, login, logout, getCurrentUser }; 








