const User = require("../models/userModel.js");

const generateAccessAndRefereshToken = async (userId) => {
  try {
    const findUser = await User.findById(userId);

    const accessToken = findUser.generateAccessToken();
    const refreshToken = findUser.generateRefreshToken();
    await findUser.save({ validateBeforeSave: false });

    return { accessToken, refreshToken };
  } catch (error) {
    console.log(error);
  }
};

module.exports = generateAccessAndRefereshToken;
