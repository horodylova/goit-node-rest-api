import jwt from 'jsonwebtoken';
import HttpError from '../helpers/HttpError.js';
import dotenv from 'dotenv';
import UserModel from '../models/userModel.js'; 

dotenv.config();

const auth = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      throw HttpError(401, 'Not authorized');
    }

    const token = authHeader.split(' ')[1];

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    console.log(decoded);

    const user = await UserModel.findById(decoded.id);
    if (!user) {
      throw HttpError(401, 'User not found');
    }

    req.user = user;

    next();
  } catch (error) {
    next(error);
  }
};

export default auth;




