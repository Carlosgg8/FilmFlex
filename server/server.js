/**
 * @file server.js
 * @description Main entry point for the FilmFlex API.
 * Initializes Express, connects to MongoDB, sets up middleware,
 * and defines API routes for movie post management.
 */

import express from "express"; // Web framework for Node.js
import dotenv from "dotenv"; // Loads environment variables from .env file
import cors from "cors"; // Enables Cross-Origin Resource Sharing
import connectDB from "./config/db.js"; // Function to connect to MongoDB
import postRoutes from "./routes/postRoutes.js"; // Routes for movie post CRUD operations

// Load environment variables from .env into process.env
dotenv.config();

// Initialize the Express application
const app = express();

// Connect to MongoDB
connectDB();

/* Middleware
 * These run before route handlers and process incoming requests
 */
app.use(express.json()); // Parse incoming JSON
app.use(cors()); // Allow cross-origin requests

// Route setup
// All requests to /api/posts are handled in postRoutes.js
app.use("/api/posts", postRoutes);

// Basic route to confirm API is running
app.get("/", (req, res) => {
  res.send("Welcome to the FilmFlex API");
});

// Set the port (from .env or fallback to 5000)
const PORT = process.env.PORT || 5000;

// Start the server
app.listen(PORT, () => {
  console.log(`FilmFlex server running on port ${PORT}`);
});
