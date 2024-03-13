import express from 'express';
import AuthController from "../controllers/AuthController.js";
import auth from "../middleware/auth.js";
import upload from '../middleware/upload.js';

const AuthRouter = express.Router();
const jsonParser = express.json();

AuthRouter.post('/register', jsonParser, AuthController.register);
AuthRouter.post('/login', jsonParser, AuthController.login);
AuthRouter.post('/logout', auth, AuthController.logout); 
AuthRouter.get('/current', auth, AuthController.getCurrentUser); 
AuthRouter.patch('/avatar', auth, upload.single('avatar'), AuthController.uploadAvatar);
AuthRouter.get("/avatar", auth, AuthController.getAvatar);


export default AuthRouter;