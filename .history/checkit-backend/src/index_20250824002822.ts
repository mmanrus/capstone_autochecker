import dotenv from 'dotenv';
dotenv.config();

import express from "express";
import userRouter from "./routes/user.routes";

import cors from 'cors'

const app = express();
const JWT_SECRET = process.env.JWT_SECRET;
const PORT = process.env.PORT || 3000;

// --- Routes ---
app.use(cors()); // Use the cors middleware here
app.use(express.json());