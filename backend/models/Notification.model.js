const mongoose = require("mongoose");

const notificationSchema = new mongoose.Schema(
  {
        user: { type: mongoose.Schema.Types.ObjectId, required: true },
      email: { type: String },
    // title: { type: String, require: true },
    // type: { type: Number, required: true },
    text: { type: String, required: true },
    read: { type: Boolean, default: false },
  },
  {
    timestamps: true,
  }
);
const NotificationModel = mongoose.model("Notification", notificationSchema);

module.exports = { NotificationModel };
