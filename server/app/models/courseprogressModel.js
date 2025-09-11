const mongoose = require("mongoose");

const courseProgressSchema = new mongoose.Schema(
  {
    urerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "user",
      required: true,
    },
    courseId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "course",
      required: true,
    },

    progress: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "lecture",
        required: true,
      },
    ],
    dateViewed: {
      type: Date,
      default: null,
    },
    completionDate: {
      type: Date,
      default: null,
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

const CourseProgress = mongoose.model("courseprogress", courseProgressSchema);

module.exports = CourseProgress;
