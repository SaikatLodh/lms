const mongoose = require("mongoose");

const scheduleSchema = new mongoose.Schema(
  {
    courseId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "course",
      required: true,
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "user",
      required: true,
    },
    instuctorId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "user",
      required: true,
    },
    reason: {
      type: String,
      required: true,
    },
    date: {
      type: Date,
      required: true,
    },
    time: {
      type: String,
      required: true,
    },
    meetingUrl: {
      type: String,
    },
    status: {
      type: String,
      required: true,
      enum: ["Waiting", "Scheduled", "Completed", "Live", "Cancelled"],
      default: "Waiting",
    },
    meetingId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "meeting",
    },
  },
  {
    timestamps: true,
  }
);

const Schedule = mongoose.model("schedule", scheduleSchema);

module.exports = Schedule;
