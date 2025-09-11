const mongoose = require("mongoose");

const ordeerSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "user",
    },
    instructorId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "user",
    },
    courseId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "course",
    },
    totalAmount: {
      type: Number,
      required: true,
    },
    orderStatus: {
      type: String,
      required: true,
      enum: ["pending", "paid", "failed"],
      default: "pending",
    },
    razorpayPaymentId: {
      type: String,
    },
    razorpayOrderId: {
      type: String,
    },
    razorpaySignature: {
      type: String,
    },
  },
  { timestamps: true }
);

const Order = mongoose.model("order", ordeerSchema);

module.exports = Order;
