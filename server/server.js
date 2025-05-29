 import express from "express";
 import connectDB from "./config/db.js"; // Import database connection
 import dotenv from "dotenv";
 // Load environment variables
 dotenv.config();
 // Initialize Express App
 const app = express();
 // Connect to MongoDB
 connectDB();
 // Use Express Middleware to parse JSON requests
 app.use(express.json());
 // Default Route
 app.get("/", (req, res) => {
  res.send("Welcome to ThoughtStream API");
 });
 // Start Server
 const PORT = process.env.PORT || 5000;
 app.listen(PORT, () => console.log(`Server running on port ${PORT}`));