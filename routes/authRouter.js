import express from 'express';
import AuthController from "../controllers/AuthController.js";

const AuthRouter = express.Router();
const jsonParser = express.json();

AuthRouter.post('/register', jsonParser, AuthController.register);

export default AuthRouter;