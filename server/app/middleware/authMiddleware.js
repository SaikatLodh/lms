const jwt = require("jsonwebtoken");
const User = require("../models/userModel.js");
const ApiError = require("../config/apiError");
const STATUS_CODES = require("../config/httpStatusCodes");

const verifyJwt = async (req, res, next) => {
  try {
    const token =
      req?.cookies?.accessToken ||
      req.header("Authorization")?.replace("Bearer ", "") ||
      req.headers["x-access-token"];

    if (!token) {
      return res
        .status(STATUS_CODES.UNAUTHORIZED)
        .json(new ApiError("Unauthorized", STATUS_CODES.UNAUTHORIZED));
    }

    const decode = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);

    if (!decode) {
      return res
        .status(STATUS_CODES.UNAUTHORIZED)
        .json(new ApiError("Invalid token", STATUS_CODES.UNAUTHORIZED));
    }

    const user = await User.findById(decode.id).select(
      "-password -resetPasswordExpire -resetPasswordToken"
    );

    if (!user) {
      return res
        .status(STATUS_CODES.NOT_FOUND)
        .json(new ApiError("User not found", STATUS_CODES.NOT_FOUND));
    }

    req.user = user;
    next();
  } catch (error) {
    console.log(error.message);
    return res
      .status(STATUS_CODES.INTERNAL_SERVER_ERROR)
      .json(new ApiError(error.message, STATUS_CODES.INTERNAL_SERVER_ERROR));
  }
};

module.exports = verifyJwt;
