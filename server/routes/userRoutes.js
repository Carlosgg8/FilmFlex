import express from "express";
import { searchUsers, getUserById, updateProfile } from "../controllers/userController.js";
import authenticateJWT from "../middleware/authMiddleware.js";
import { toggleFollow } from "../controllers/userController.js";

const router = express.Router();

// Search users
router.get("/search", authenticateJWT, searchUsers);

// Get user by ID
router.get("/:userId", authenticateJWT, getUserById);

// Follow user
router.post("/:userId/follow", authenticateJWT, toggleFollow);

// Edit profile
router.put("/profile", authenticateJWT, updateProfile)

export default router;
