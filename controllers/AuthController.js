import UserModel from "../models/user.js";

async function register(req, res, next) {
  try {
    const newUser = await UserModel.create(req.body);

    res.status(200).send('User registered successfully');
  } catch (error) {
    next(error);
  }
}

export default { register };
