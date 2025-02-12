import express from "express";
import dotenv from "dotenv";

// Middleware config
const app = express();
app.use(express.json());
const router = express.Router();

//.env config
dotenv.config();
const PORT = process.env.PORT || 3000;

export { app, PORT, router };
