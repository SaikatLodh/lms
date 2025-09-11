const mongoose = require("mongoose");
const validator = require("validator");

const announcementSchema = new mongoose.Schema(
  {
    courseId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "course",
      required: true,
    },
    lecturerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "user",
      required: true,
    },
    title: {
      type: String,
      required: true,
      validate: [
        {
          validator: function (v) {
            return validator.isLength(v, { min: 5, max: 500 });
          },
          message: "Title must be between 5 and 500 characters long",
        },
      ],
    },
    description: {
      type: String,
      required: true,
      validate: [
        {
          validator: function (v) {
            return validator.isLength(v, { min: 10, max: 500 });
          },
          message: "Description must be between 10 and 500 characters long",
        },
      ],
    },
    isDeleted: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

const Announcement = mongoose.model("announcement", announcementSchema);

module.exports = Announcement;
