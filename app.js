import express from "express";
import cors from "cors";
import morgan from "morgan";
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import { promises as fsPromises } from 'fs';

import contactsRouter from "./routes/contactsRouter.js";

const { readFile } = fsPromises;
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

app.get("/", (_, res) => res.send("<h2>Home page</h2>"));

// app.get("/contacts", async (_, res) => {
//   try {
//     const data = await readFile(join(__dirname, "db", "contacts.json"), "utf8");
//     res.send(data);
//   } catch (error) {
//     console.error("Error reading contacts:", error);
//     res.status(500).json({ message: "Server error" });
//   }
// });

app.get('/contact/:id', (req, res) => {
  res.send(`<h1>Contact</h1> Параметр: ${req.params.id}`);
});

app.use((_, res) => res.status(404).json({ message: "Route not found" }));

app.use((err, _, res, __) => {
  const { status = 500, message = "Server error" } = err;
  res.status(status).json({ message });
});

