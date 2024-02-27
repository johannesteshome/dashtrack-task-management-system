const express = require("express");
const router = express.Router();

const {
  getAllNotifications,
  deleteNotification,
  deleteAllNotifications,
  markOneNotificationAsread,
  markAllNotificationsAsRead,
  getUnreadNotifications,
} = require("../controller/notification.controller");
const { authenticateUser } = require("../middlewares/authentication");
const { logActivity } = require("../middlewares/log");
const { upload } = require("../middlewares/fileUpload");

router.get("/allNotifications/:id", authenticateUser, getAllNotifications);
router.get(
  "/unreadNotifications/:id",
  authenticateUser,
  getUnreadNotifications
);
router.put(
  "/readNotification/:id",
  authenticateUser,
  markOneNotificationAsread
);
router.put(
  "/readAllNotifications/:userId",
  authenticateUser,
  markAllNotificationsAsRead
);
router.delete("/deleteNotification/:id", authenticateUser, deleteNotification);
router.delete(
  "/deleteAllNotifications/:userId",
  authenticateUser,
  deleteAllNotifications
);

module.exports = router;
