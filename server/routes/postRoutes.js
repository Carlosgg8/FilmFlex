import express from "express";
 import {
  createEntry,
  getAllEntries,
  getEntryById,
  updateEntry,
  deleteEntry,
 } from "../controllers/postController.js";
 const router = express.Router();
 /**
 * @route  GET /api/diary
 * @desc   Fetch all diary entries
 * @access Public (Authentication will be added in Part 2)
 */
 router.get("/", getAllEntries);
 /**
 * @route  GET /api/diary/:id
 * @desc   Fetch a specific diary entry by ID
 * @access Public (Authentication will be added in Part 2)
 */
 router.get("/:id", getEntryById);
 export default router;