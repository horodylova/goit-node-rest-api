import bcrypt from 'bcrypt';
import UserModel from "../models/userModel.js";

async function register(req, res, next) {
  try {
    const { password, email, subscription, token } = req.body;

    const normalizedEmail = email.toLowerCase();

    const hashedPassword = await bcrypt.hash(password, 10);

    const existingUser = await UserModel.findOne({ email: normalizedEmail });
    if (existingUser) {
      return res.status(409).send('User with this email already exists');
    }

    const newUser = await UserModel.create({ password: hashedPassword, email: normalizedEmail, subscription, token });

    console.log(newUser);

    res.status(201).send('User registered successfully');
  } catch (error) {
    next(error);
  }
}

async function login(req, res, next) {
  const { email, password } = req.body;
  const normalizedEmail = email.toLowerCase();

  try {
    const user = await UserModel.findOne({ email: normalizedEmail });
    if (!user) {
      return res.status(401).send({ message: "Email or password incorrect" });
    }

    const passwordMatch = await bcrypt.compare(password, user.password);
    if (!passwordMatch) {
      return res.status(401).send({ message: "Email or password incorrect" });
    }

    res.status(200).send({ message: "Login successful" });
  } catch (error) {
    next(error);
  }
}

export default { register, login };


