import express from 'express';
import AuthController from "../controllers/AuthController.js";
import auth from "../middleware/auth.js";

const AuthRouter = express.Router();
const jsonParser = express.json();

AuthRouter.post('/register', jsonParser, AuthController.register);
AuthRouter.post('/login', jsonParser, AuthController.login);
AuthRouter.get('/logout', auth, AuthController.logout); 
AuthRouter.get('/current', auth, AuthController.getCurrentUser); 

export default AuthRouter;
