import dotenv from "dotenv";
import UserModel from "../models/userModel.js";
import HttpError from "../helpers/HttpError.js";

dotenv.config();

export const verify (req, res, next) {
    console.log('Verifying');
};