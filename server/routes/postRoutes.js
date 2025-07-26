import express from "express";
import {
  createEntry,
  getAllEntries,
  getEntryById,
  getUserEntries,        
  getEntriesByUserId,    
  updateEntry,
  deleteEntry
} from "../controllers/postController.js"; 
 import authenticateJWT from "../middleware/authMiddleware.js";

const router = express.Router();

  router.get("/", authenticateJWT, getAllEntries);
  router.get("/me", authenticateJWT, getUserEntries);
  router.get("/user/:userId", authenticateJWT, getEntriesByUserId);
  router.post("/", authenticateJWT, createEntry);
  router.get("/:id", authenticateJWT, getEntryById);
  router.put("/:id", authenticateJWT, updateEntry);
  router.delete("/:id", authenticateJWT, deleteEntry);

export default router;