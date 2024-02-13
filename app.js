import express from "express";
import cors from "cors";
import morgan from "morgan";
import { fileURLToPath } from 'url';
import { dirname } from 'path';

import contactsRouter from "./routes/contactsRouter.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();
app.use(cors());
app.use(express.static(__dirname));
app.use(morgan("tiny"));
app.use(express.json());
app.use("/api/contacts", contactsRouter);

app.listen(3000, () => {
  console.log("The server is up and running. Use our API on port: 3000");
});

app.use((err, _, res, __) => {
  const { status = 500, message = "Server error" } = err;
  res.status(status).json({ message });
});
