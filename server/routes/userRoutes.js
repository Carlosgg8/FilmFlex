import express from "express";
import { searchUsers, getUserById, updateProfile } from "../controllers/userController.js";
import authenticateJWT from "../middleware/authMiddleware.js";
import { toggleFollow } from "../controllers/userController.js";
import { toggleSavePost, getSavedPosts } from "../controllers/bookmarkController.js";

const router = express.Router();

// Search users
router.get("/search", authenticateJWT, searchUsers);

// Bookmark routes (MUST come before /:userId to avoid route collision)
router.get("/saved", authenticateJWT, getSavedPosts);
router.post("/saved/:postId", authenticateJWT, toggleSavePost);

// Edit profile
router.put("/profile", authenticateJWT, updateProfile)

// Get user by ID (MUST come after specific routes like /saved, /search, /profile)
router.get("/:userId", authenticateJWT, getUserById);

// Follow user
router.post("/:userId/follow", authenticateJWT, toggleFollow);

export default router;
