import express from "express";

import verify from "../controllers/verifyController.js";

const verifyRouter = express.Router();
verifyRouter.get('/verify/', verifyController.verify);

