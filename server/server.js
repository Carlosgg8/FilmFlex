/**
 * @file server.js
 * @description Main entry point for the FilmFlex API.
 * Initializes Express, connects to MongoDB, sets up middleware,
 * and defines API routes for movie post management.
 */

import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import connectDB from "./config/db.js";
import postRoutes from "./routes/postRoutes.js";
import authRoutes from "./routes/authRoutes.js";

dotenv.config(); // Load environment variables

const app = express(); // Initialize Express

connectDB(); // Connect to MongoDB

// Middleware 
app.use(express.json({ limit: '50mb' })); // Parse JSON with 50mb limit
app.use(express.urlencoded({ limit: '50mb', extended: true })); // Parse URL-encoded data
app.use(cors({ origin: "http://localhost:5173", credentials: true })); 

// Routes
app.use("/api/posts", postRoutes);
app.use("/api/auth", authRoutes);

// Test route
app.get("/", (req, res) => {
  res.send("Welcome to the FilmFlex API");
});

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`FilmFlex server running on port ${PORT}`);
});
