const mongoose = require("mongoose");
const validator = require("validator");

const scheduleSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "user",
      required: true,
    },
    courseId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "course",
      required: true,
    },
    instructorId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "user",
      required: true,
    },
    meetingName: {
      type: String,
      required: true,
    },
    duration: {
      type: Number,
      enum: [15, 30, 60, 120],
      required: true,
    },
    roomId: {
      type: String,
      required: true,
    },
    date: {
      type: Date,
      required: true,
    },
    startTime: {
      type: String,
      required: true,
    },
    endTime: {
      type: String,
      required: true,
    },
    meetingUrl: {
      type: String,
      required: true,
    },
    completed: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

const Meeting = mongoose.model("meeting", scheduleSchema);

module.exports = Meeting;
