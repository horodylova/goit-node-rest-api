import bcrypt from 'bcrypt';
import UserModel from "../models/userModel.js";

async function register(req, res, next) {
  try {
    const { password, email, subscription, token } = req.body;

    const hashedPassword = await bcrypt.hash(password, 10);

    const existingUser = await UserModel.findOne({ email });
    if (existingUser) {
      return res.status(400).send('User with this email already exists');
    }

    const newUser = await UserModel.create({ password: hashedPassword, email, subscription, token });

    console.log(newUser);

    res.status(201).send('User registered successfully');
  } catch (error) {
    next(error);
  }
}

export default { register };


