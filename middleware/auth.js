import jwt from 'jsonwebtoken';
import HttpError from '../helpers/HttpError.js';
import dotenv from 'dotenv';

dotenv.config();

const auth = (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      throw HttpError(401, 'Not authorized');
    }

    const token = authHeader.split(' ')[1];

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;

    next();
  } catch (error) {
    next(error);
  }
};

export default auth;



