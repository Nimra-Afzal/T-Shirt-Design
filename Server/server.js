import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import cors from "cors";
import bodyParser from "body-parser";
import * as path from 'path';
import { fileURLToPath } from 'url';
import authRoutes from "./routes/authRoutes.js";
import orderRoutes from "./routes/orderRoutes.js";
import adminRoutes from "./routes/adminRoutes.js";
import imageGenerationRoutes from './routes/imageGenerationRoutes.js';

dotenv.config(); // Load environment variables

const app = express();

// Get the directory name
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.use(bodyParser.json({ limit: '50mb' }));
app.use(bodyParser.urlencoded({ limit: '50mb', extended: true }));
app.use(cors());

// Serve static files from the uploads directory
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

app.use("/api/auth", authRoutes);
app.use("/api", orderRoutes);
app.use("/api/admin", adminRoutes);
app.use('/api', imageGenerationRoutes);

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => app.listen(5001, () => console.log("Server is running on Port 5001")))
  .catch((err) => console.log(`Database connection error: ${err.message}`));
