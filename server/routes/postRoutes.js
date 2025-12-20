import express from "express";
import {
  createEntry,
  getAllEntries,
  getEntryById,
      
  getEntriesByUserId,    
  updateEntry,
  deleteEntry,
  likeEntry,
  addComment,
  likeComment
} from "../controllers/postController.js"; 
 import authenticateJWT from "../middleware/authMiddleware.js";

const router = express.Router();

  router.get("/", authenticateJWT, getAllEntries);

  router.get("/user/:userId", authenticateJWT, getEntriesByUserId);
  router.post("/", authenticateJWT, createEntry);
  router.get("/:id", authenticateJWT, getEntryById);
  router.put("/:id", authenticateJWT, updateEntry);
  router.delete("/:id", authenticateJWT, deleteEntry);
  router.post("/:id/like", authenticateJWT, likeEntry);
  router.post("/:id/comment", authenticateJWT, addComment);
  router.post("/:postId/comments/:commentId/like", authenticateJWT, likeComment);

export default router;