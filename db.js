import dotenv from "dotenv";
dotenv.config({ path: "./envs/development.env" });

import mongoose from "mongoose";

const DB_URL = process.env.MONGO_URL;

mongoose
  .connect(DB_URL)
  .then(() => console.log("Database connected"))
  .catch((error) => {
    console.error("Error connecting to database:"), error;
    process.exit(1);
  });
