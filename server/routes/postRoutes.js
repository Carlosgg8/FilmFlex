import express from "express";
import {
  createEntry,
  getAllEntries,
  getEntryById,
  updateEntry,
  deleteEntry,
} from "../controllers/postController.js"; // Make sure this matches your controller filename
 import { ensureAuthenticated } from "../middleware/authMiddleware.js";

const router = express.Router();

 router.get("/", ensureAuthenticated, getAllEntries);
 router.post("/", ensureAuthenticated, createEntry);
 router.get("/:id", ensureAuthenticated, getEntryById);
 router.put("/:id", ensureAuthenticated, updateEntry);
 router.delete("/:id", ensureAuthenticated, deleteEntry);;

export default router;