const mongoose = require("mongoose");

const notificationSchema = new mongoose.Schema(
  {
    senderId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "user",
      required: true,
    },
    receiverId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "user",
      required: true,
    },
    title: {
      type: String,
      required: true,
    },
    message: {
      type: String,
      required: true,
    },
    seen: {
      type: Boolean,
      default: false,
    },
    messageType: {
      type: String,
      required: true,
      enum: ["user", "instructor", "admin"],
    },
  },
  { timestamps: true }
);

const Notification = mongoose.model("notification", notificationSchema);

module.exports = Notification;
