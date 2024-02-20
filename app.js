import express from "express";
import morgan from "morgan";
import cors from "cors";
import mongoose from "mongoose";
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import contactsRouter from "./routes/contactsRouter.js";

dotenv.config({ path: './envs/development.env' });

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();

const port = process.env.PORT;
const mongoURI = process.env.MONGO_URL;

mongoose.connect(mongoURI)
  .then(() => {
    console.log("MongoDB connected");
    app.listen(port, () => {
      console.log(`Server is running. Use our API on port: ${port}`);
    });
  })
  .catch((err) => {
    console.error("MongoDB connection error:", err);
    process.exit(1);
  });


app.use(morgan("tiny"));
app.use(cors());
app.use(express.static(__dirname));
app.use(express.json());

app.use((req, res, next) => {
  console.log("Request received:", req.method, req.url);
  next();
});

app.use("/api/contacts", contactsRouter);

app.use((err, req, res, next) => {
  const { status = 500, message = "Server error" } = err;
  res.status(status).json({ message });
});

export default app;


