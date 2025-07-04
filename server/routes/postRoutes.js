import express from "express";
import {
  createEntry,
  getAllEntries,
  getEntryById,
  updateEntry,
  deleteEntry,
} from "../controllers/postController.js"; // Make sure this matches your controller filename
 import authenticateJWT from "../middleware/authMiddleware.js";

const router = express.Router();

  router.get("/", authenticateJWT, getAllEntries);
 router.post("/", authenticateJWT, createEntry);
 router.get("/:id", authenticateJWT, getEntryById);
 router.put("/:id", authenticateJWT, updateEntry);
 router.delete("/:id", authenticateJWT, deleteEntry);

export default router;