import morgan from "morgan";
import cors from "cors";
import './db.js';
import express from "express"; 
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import contactsRouter from "./routes/contactsRouter.js";
import AuthRouter from "./routes/authRouter.js";
import auth from "./middleware/auth.js";


const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();

app.use(morgan("tiny"));
app.use(cors());
app.use(express.static(__dirname));
app.use(express.json());

const PORT = process.env.PORT || 3000; 
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

app.use((req, res, next) => {
  console.log("Request received:", req.method, req.url);
  next();
});

app.use("/users", AuthRouter);
app.use("/api/contacts", auth, contactsRouter);

app.use((err, req, res, next) => {
  console.error("An error occurred:", err);
  const { status = 500, message = "Server error" } = err;
  res.status(status).json({ message });
});

export default app;