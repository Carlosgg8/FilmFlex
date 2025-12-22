import express from "express";
import { searchUsers, getUserById } from "../controllers/userController.js";
import authenticateJWT from "../middleware/authMiddleware.js";

const router = express.Router();

// Search users
router.get("/search", authenticateJWT, searchUsers);

// Get user by ID
router.get("/:userId", authenticateJWT, getUserById);

export default router;
