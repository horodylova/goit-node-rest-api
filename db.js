import dotenv from "dotenv";
import mongoose from "mongoose";
import express from "express"; 

dotenv.config({ path: "./envs/development.env" });

const DB_URL = process.env.MONGO_URL;

mongoose
  .connect(DB_URL)
  .then(() => console.log("Database connected"))
  .catch((error) => {
    console.error("Error connecting to database:", error); 
    process.exit(1);
  });