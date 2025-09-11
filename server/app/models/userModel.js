const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const crypto = require("crypto");
const validator = require("validator");

const userSchema = new mongoose.Schema(
  {
    fullName: {
      type: String,
      required: true,
      trim: true,
      validate: [
        {
          validator: function (v) {
            return validator.isLength(v, { min: 3, max: 50 });
          },
          message: "Full name must be between 3 and 50 characters long",
        },
      ],
    },
    email: {
      type: String,
      required: true,
      trim: true,
      unique: true,
      validate: [
        {
          validator: function (v) {
            return validator.isEmail(v);
          },
          message: "Please enter a valid email",
        },
      ],
    },
    password: {
      type: String,
      required: true,
      validate: [
        {
          validator: function (v) {
            return validator.isLength(v, { min: 6, max: 30 });
          },
          message: "Password must be between 6 and 20 characters long",
        },
      ],
    },
    profilePicture: {
      public_id: {
        type: String,
      },
      url: {
        type: String,
      },
    },
    gooleavatar: {
      type: String,
    },
    faceBookavatar: {
      type: String,
    },
    fbId: {
      type: String,
    },
    role: {
      type: String,
      enum: ["user", "instructor", "admin"],
      default: "user",
    },
    isVerified: {
      type: Boolean,
      default: false,
    },
    forgotPasswordToken: {
      type: String,
      default: null,
    },
    forgotPasswordExpiry: {
      type: Date,
      default: null,
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

userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) {
    return next();
  }
  this.password = await bcrypt.hash(this.password, 10);
  next();
});

userSchema.methods.comparePassword = async function (password) {
  return await bcrypt.compare(password, this.password);
};

userSchema.methods.generateAccessToken = function () {
  return jwt.sign(
    { id: this._id, role: this.role },
    process.env.ACCESS_TOKEN_SECRET,
    {
      expiresIn: process.env.ACCESS_TOKEN_EXPIRATION_TIME,
    }
  );
};

userSchema.methods.generateRefreshToken = function () {
  return jwt.sign(
    { id: this._id, role: this.role },
    process.env.REFRESH_TOKEN_SECRET,
    {
      expiresIn: process.env.REFRESH_TOKEN_EXPIRATION_TIME,
    }
  );
};

userSchema.methods.getResetPasswordToken = function () {
  const resetToken = crypto.randomBytes(20).toString("hex");
  this.forgotPasswordToken = crypto
    .createHash("sha256")
    .update(resetToken)
    .digest("hex");
  this.forgotPasswordExpiry = Date.now() + 15 * 60 * 1000;
  return resetToken;
};

const User = mongoose.model("user", userSchema);

module.exports = User;
