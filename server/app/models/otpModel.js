const mongoose = require("mongoose");

const otpSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      unique: true,
    },
    otp: {
      type: Number,
      required: true,
    },
    otpExpire: {
      type: Date,
      default: null,
      required: true,
    },
    isotpsend: {
      type: Boolean,
      default: false,
    },
    otpVerified: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

const Otp = mongoose.model("otp", otpSchema);

module.exports = Otp;
