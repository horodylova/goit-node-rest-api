import UserModel from "../models/userModel.js";

async function register(req, res, next) {
  try {
    const { password, email, subscription, token } = req.body;
    const result = await UserModel.create({password, email, subscription, token});
    
    console.log(result);

    res.status(201).send('User registered successfully');
  } catch (error) {
    next(error);
  }
}

export default { register };
