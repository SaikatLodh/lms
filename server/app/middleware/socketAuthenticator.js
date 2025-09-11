const jwt = require("jsonwebtoken");
const User = require("../models/userModel.js");
const ApiError = require("../config/apiError");
const STATUS_CODES = require("../config/httpStatusCodes");

const socketAuthenticator = async (err, socket, next) => {
  try {
    if (err) {
      return next(
        new ApiError(err.message, STATUS_CODES.INTERNAL_SERVER_ERROR)
      );
    }

    const cookieString = socket.handshake.headers.cookie;

    const token = cookieString
      .split(";")
      .find((str) => str.trim().startsWith("accessToken="))
      ?.split("=")[1];

    if (!token) {
      return next(new ApiError("Unauthorized", STATUS_CODES.UNAUTHORIZED));
    }

    const decode = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);

    if (!decode) {
      return next(new ApiError("Invalid token", STATUS_CODES.UNAUTHORIZED));
    }

    const user = await User.findById(decode.id).select(
      "-password -resetPasswordExpire -resetPasswordToken"
    );

    if (!user) {
      return next(new ApiError("User not found", STATUS_CODES.NOT_FOUND));
    }

    socket.user = user;

    next();
  } catch (error) {
    return next(new ApiError(error.message, STATUS_CODES.FORBIDDEN));
  }
};

module.exports = socketAuthenticator;
