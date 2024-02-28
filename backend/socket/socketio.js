const { UserModel } = require("../models/user.model");
const {NotificationModel} = require("../models/Notification.model");
let usersio = [];

module.exports = function (io) {
    io.on("connection", (socket) => {
      console.log('⚡ Socket: Connected');
        socket.on("subscribeToNotifications", (email) => {
          // Store the user ID in the socket's data
          console.log(email, 'email in socket');
          socket.email = email;
          console.log(socket.email, 'email in scoket');

          // Retrieve unread notifications for the user from the database
          
          NotificationModel.find({ email: email })
            .then((notifications) => {
              // Emit the notifications to the client
              console.log('emitted notification to client');
              socket.emit("notifications", notifications);
            })
            .catch((error) => {
              console.error("Error retrieving notifications:", error);
            });
        });

        // Handle notification creation
        socket.on("createNotification", (notification) => {
          // Check if the notification is intended for the current user
          // console.log(socket, 'socket in create notification');
          console.log(notification.email, socket.email, "the notification");

          
          // create notification in database
          
          // const createNotification = async (notification) => {
          //   try {
          //     console.log("creating notification");
          //     const notificationDatabase = await NotificationModel.create(
          //       notification
          //     );
          //     return notificationDatabase;
          //   } catch (error) {
          //     // Handle any potential errors here
          //     console.error("Error while creating notification:", error);
          //     throw error; // Re-throw the error to be handled by the caller
          //   }
          // };

          // Example usage of the async function
          let notifDB = null;
          (async () => {
            try {
              console.log("creating notification");
              notifDB = await NotificationModel.create(
                notification)
              console.log("Notification created:", notifDB);
            } catch (error) {
              // Handle the error from the async function
              console.error("Error in example usage:", error);
            }
          })();

          if (!notifDB) {
            console.log("Notification not created:", notifDB);
            return;
          }

          console.log("emitting notification");
          socket.emit("notification", newNotification);

          //   const newNotification = new NotificationModel(notification);
          //   console.log(newNotification, 'newNotifications');
          // newNotification
          //   .save()
          //   .then(() => {
          //       // Emit the new notification to the client
          //     console.log('emitting notification');
          //     socket.emit("notification", newNotification);
          //   })
          //   .catch((error) => {
          //     console.error("Error creating notification:", error);
          //   });
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
