import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import UserModel from "../models/userModel.js";
import dotenv from 'dotenv';
dotenv.config();

async function register(req, res, next) {
  try {
    const { password, email, subscription, token } = req.body;

    const normalizedEmail = email.toLowerCase();

    const existingUser = await UserModel.findOne({ email: normalizedEmail });
    if (existingUser) {
      return res.status(409).send('User with this email already exists');
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
      return res.status(400).send({ message: "Email is required" });
    }

    const normalizedEmail = email.toLowerCase();

    const user = await UserModel.findOne({ email: normalizedEmail });
    if (!user) {
      return res.status(401).send({ message: "Email or password incorrect" });
    }

    const passwordMatch = await bcrypt.compare(password, user.password);
    if (!passwordMatch) {
      return res.status(401).send({ message: "Email or password incorrect" });
    }

    const token = jwt.sign({
      id: user._id
    }, process.env.JWT_TOKEN);

    res.send({ token });
  } catch (error) {
    console.error("Error during login:", error);
    next(error);
  }
}

export default { register, login };







