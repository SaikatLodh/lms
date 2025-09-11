const jwt = require("jsonwebtoken");
const User = require("../models/userModel.js");

const adminVerifyJwt = async (req, res, next) => {
  try {
    const token = req?.cookies?.accessToken;

    if (!token) {
      return res.redirect("/login");
    }

    const decode = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);

    if (!decode) {
      req.flash("error", "Invalid token");
      return res.redirect("/login");
    }

    const user = await User.findById(decode.id).select(
      "-password -resetPasswordExpire -resetPasswordToken"
    );

    if (!user) {
      req.flash("error", "User not found");
      return res.redirect("/login");
    }

    req.user = user;
    next();
  } catch (error) {
    console.log(error.message);
    req.flash("error", error.message);
    return res.redirect("/login");
  }
};

module.exports = adminVerifyJwt;
