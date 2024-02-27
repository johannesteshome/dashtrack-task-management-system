const { UserModel } = require("../models/user.model");
const {NotificationModel} = require("../models/Notification.model");
let usersio = [];

module.exports = function (io) {
    io.on("connection", (socket) => {
        console.log('⚡ Socket: Connected');
        socket.on("subscribeToNotifications", (userId) => {
          // Store the user ID in the socket's data
          socket.userId = userId;

          // Retrieve unread notifications for the user from the database
          NotificationModel.find({ userId: socket.userId })
            .then((notifications) => {
              // Emit the notifications to the client
              socket.emit("notifications", notifications);
            })
            .catch((error) => {
              console.error("Error retrieving notifications:", error);
            });
        });

        // Handle notification creation
        socket.on("createNotification", (notification) => {
            // Check if the notification is intended for the current user
            if (notification.userId === socket.userId) {
              console.log('creating notification');
            // Save the notification to the database
            const newNotification = new NotificationModel(notification);
            newNotification
              .save()
              .then(() => {
                  // Emit the new notification to the client
                console.log('emitting notification');
                socket.emit("notification", newNotification);
              })
              .catch((error) => {
                console.error("Error creating notification:", error);
              });
          }
        });

        // Handle client disconnections
        socket.on("disconnect", () => {
          console.log("A user disconnected:", socket.id);
        });
    // socket.on("setUserId", async (userId) => {
    //   if (userId) {
    //     const oneUser = await UserModel.findById(userId).lean().exec();
    //     if (oneUser) {
    //       usersio[userId] = socket;
    //       console.log(`⚡ Socket: User with id ${userId} connected`);
    //     } else {
    //       console.log(`🚩 Socket: No user with id ${userId}`);
    //     }
    //   }
    // });
    // socket.on("getNotificationsLength", async (userId) => {
    //   const notifications = await NotificationModel
    //     .find({ user: userId, read: false })
    //     .lean();
    //   usersio[userId]?.emit("notificationsLength", notifications.length || 0);
    // });

    // socket.on("disconnect", (userId) => {
    //   console.log(`🔥 user with id ${userId} disconnected from socket`);
    //   usersio[userId] = null;
    // });
  });
};
