const { NotificationModel } = require("../models/Notification.model");
// const { UserModel } = require("../models/User.model");
const { StatusCodes } = require("http-status-codes");
const { UserModel } = require("../models/user.model");

// @desc Get all notifications
// @Route GET /notes
// @Access Private
const getAllNotifications = async (req, res) => {
  const id = req.params.id;
  const {email} = await UserModel.findById(id);
  const filteredNotifications = await NotificationModel.find({
    email: email,
  }).lean();
  // console.log(filteredNotifications, 'filtered Notifications');

  if (!filteredNotifications) {
    return res
      .status(400)
      .json({
        message: "No notifications found",
        notifications: [],
        success: true,
      });
  }

  res.json({
    message: "success",
    notifications: filteredNotifications,
    success: true,
  });
};

const getUnreadNotifications = async (req, res) => {
  const id = req.params.id;
  const {email} = await UserModel.findById(id);
  const unreadNotifications = await NotificationModel.find({
    email: email,
    read: false,
  });
  return res
    .status(StatusCodes.OK)
    .json({
      message: "success",
      unreadNotifications: unreadNotifications.length,
      success: true,
    });
};

// @desc delete a notification
// @Route DELETE /notifications
// @Private access
const deleteNotification = async (req, res) => {
  const id = req.params.id;
  if (!id) {
    return res.status(400).json({ message: `You must give a valid id: ${id}` });
  }

  const deleteNotification = await NotificationModel.findById(id).exec();
  if (!deleteNotification) {
    return res
      .status(400)
      .json({ message: `Can't find a notification with id: ${id}` });
  }
  const result = await deleteNotification.deleteOne();
  if (!result) {
    return res
      .status(400)
      .json({ message: `Can't delete the notification with id: ${id}` });
  }
  res.json({ message: `Notification with id: ${id} deleted with success` });
};

// @desc delete All notification
// @Route DELETE /notifications/all
// @Private access
const deleteAllNotifications = async (req, res) => {
  const { id } = req.body;
  if (!id) {
    return res.status(400).json({ message: `You must give a valid id: ${id}` });
  }
  const notificationsDeleteMany = await NotificationModel.deleteMany({
    user: id,
  });
  if (!notificationsDeleteMany) {
    return res
      .status(400)
      .json({ message: "Error Deleting all notifications as read" });
  }
  res.json({ message: `All notifications for user ${id}marked was deleted` });
};
// @desc Mark One Notification As Read
// @Route Patch /notifications/
// @Access Private
const markOneNotificationAsread = async (req, res) => {
  const id = req.params.id;
  if (!id) {
    return res.status(400).json({ message: `You must give a valid id: ${id}` });
  }
  const filter = { _id: id }; 
  const update = { read: true }; 
  const updatedNotification = await NotificationModel.updateOne(filter, update);
  if (!updatedNotification) {
    return res.status(400).json({ message: "Error Marking notification as read" });
  }
  
    
  res.json(updatedNotification);
};
// @desc Mark All Notifications As Read
// @Route Patch /notifications/All
// @Access Private
const markAllNotificationsAsRead = async (req, res) => {
  const userId = req.params.userId;
  if (!userId) {
    return res.status(400).json({ message: `You must give a valid id: ${id}` });
  }
  const notificationsUpdateMany = await NotificationModel.updateMany(
    { user: userId },
    { $set: { read: true } }
  );
  if (!notificationsUpdateMany) {
    return res
      .status(400)
      .json({ message: "Error Marking all notifications as read" });
  }
  res.json({ message: `All notifications for user ${userId} marked as read`, success: true });
};
module.exports = {
  getAllNotifications,
  deleteNotification,
  deleteAllNotifications,
  markOneNotificationAsread,
  markAllNotificationsAsRead,
  getUnreadNotifications,
};
