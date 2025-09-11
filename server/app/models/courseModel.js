const mongoose = require("mongoose");
const validator = require("validator");

const courseSchema = new mongoose.Schema(
  {
    instructorId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "user",
    },
    instructorName: {
      type: String,
      required: true,
    },
    title: {
      type: String,
      required: true,
      validate: [
        {
          validator: function (v) {
            return validator.isLength(v, { min: 5, max: 100 });
          },
          message: "Title must be between 5 and 100 characters long",
        },
      ],
    },
    category: {
      type: String,
      required: true,
    },
    level: {
      type: String,
      enum: ["beginner", "intermediate", "advanced"],
      required: true,
    },
    primaryLanguage: {
      type: String,
      required: true,
    },
    subtitle: {
      type: String,
      required: true,
      validate: [
        {
          validator: function (v) {
            return validator.isLength(v, { min: 5, max: 100 });
          },
          message: "Subtitle must be between 5 and 100 characters long",
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
    image: {
      public_id: {
        type: String,
        required: true,
      },
      url: {
        type: String,
        required: true,
      },
    },
    welcomeMessage: {
      type: String,
      required: true,
      validate: [
        {
          validator: function (v) {
            return validator.isLength(v, { min: 10, max: 500 });
          },
          message: "Welcome message must be between 10 and 500 characters long",
        },
      ],
    },
    pricing: {
      type: Number,
      required: true,
    },
    students: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "user",
      },
    ],
    reviews: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "review",
      },
    ],
    lectures: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "lecture",
      },
    ],
    announcements: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "announcement",
      },
    ],
    orders: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "order",
      },
    ],
    isPublised: {
      type: Boolean,
      default: false,
    },
    status: {
      type: String,
      enum: ["draft", "published", "cancelled"],
      default: "draft",
    },
    isDeleted: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

const Cours = mongoose.model("course", courseSchema);

module.exports = Cours;
