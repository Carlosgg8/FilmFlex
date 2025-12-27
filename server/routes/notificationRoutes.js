import express from "express";
import {
  getNotifications,
  getUnreadCount,
  markAsRead,
  markAllAsRead,
  deleteNotification
} from "../controllers/notificationController.js";
import authenticateJWT from "../middleware/authMiddleware.js";

const router = express.Router();

// Get all notifications for logged-in user
router.get("/", authenticateJWT, getNotifications);

// Get unread notification count
router.get("/unread-count", authenticateJWT, getUnreadCount);

// Mark single notification as read
router.put("/:id/read", authenticateJWT, markAsRead);

// Mark all notifications as read
router.put("/mark-all-read", authenticateJWT, markAllAsRead);

// Delete a notification
router.delete("/:id", authenticateJWT, deleteNotification);

export default router;
