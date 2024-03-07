import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import UserModel from "../models/userModel.js";
import HttpError from '../helpers/HttpError.js'; 
import dotenv from 'dotenv';
dotenv.config();

const register = async (req, res, next) => {
  try {
      const { password, email, subscription, token } = req.body;

      if (!email || !password) {
          throw HttpError(400, 'Email and password are required');
      }

      const existingUser = await UserModel.findOne({ email });
      if (existingUser) {
          throw HttpError(409, 'Email in use');
      }

      const hashedPassword = await bcrypt.hash(password, 10);

      const newUser = await UserModel.create({
          email,
          password: hashedPassword,
          subscription,
          token: null  
      });

      const newToken = jwt.sign({
          id: newUser._id
      }, process.env.JWT_TOKEN);

      newUser.token = newToken;
      await newUser.save();

      res.status(201).json({
          user: {
              email: newUser.email,
              subscription: newUser.subscription
          }
      });
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

    const normalizedEmail = email.toLowerCase();

    const user = await UserModel.findOne({ email: normalizedEmail });
    if (!user) {
      throw HttpError(401, "Email or password is wrong");  
    }

    const passwordMatch = await bcrypt.compare(password, user.password);
    if (!passwordMatch) {
      throw HttpError(401, "Email or password is wrong");  
    }

    const token = jwt.sign({
      id: user._id
    }, process.env.JWT_TOKEN);

    await UserModel.findByIdAndUpdate(user._id, { token });

    res.status(200).json({
      token,
      user: {
        email: user.email,
        subscription: user.subscription
      }
    });
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

    res.status(200).json({ email, subscription } );
  } catch (error) {
    next(error);
  }
};



export default { register, login, logout, getCurrentUser };











