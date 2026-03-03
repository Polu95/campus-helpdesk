import dotenv from "dotenv";
dotenv.config();   // MUST BE FIRST

import express from "express";
import cors from "cors";
import connectDB from "./config/db.js";
import { configureCloudinary } from "./config/cloudinary.js";

import complaintRoutes from "./modules/complaint/complaint.routes.js";
import authRoutes from "./modules/auth/auth.routes.js";

const app = express();

// Connect DB
connectDB();

// Configure Cloudinary
configureCloudinary();

// Middlewares
app.use(cors());
app.use(express.json());

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/complaints", complaintRoutes);

app.get("/", (req, res) => {
  res.send("API Running");
});

// Start Server
app.listen(process.env.PORT || 5000, () =>
  console.log(`Server running on port ${process.env.PORT || 5000}`)
);