import mongoose from "mongoose";
 import dotenv from "dotenv";
 dotenv.config();                    // Load environment variables
 const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI, {
      serverSelectionTimeoutMS: 5000, // Avoid hanging on failed connections
    });
    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`MongoDB Connection Error: ${error.message}`);
    process.exit(1);                 // Exit process with failure
  }
 };
 export default connectDB;