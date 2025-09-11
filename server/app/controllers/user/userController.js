const User = require("../../models/userModel");
const Course = require("../../models/courseModel");
const apiResponse = require("../../config/apiResponse");
const apiError = require("../../config/apiError");
const STATUS_CODES = require("../../config/httpStatusCodes");
const { deleteImage, uploadFile } = require("../../helpers/cloudinary");
const {
  updateUserValidation,
} = require("../../helpers/validation/user/userValidation");
const mongooseValidObjectId = require("mongoose").isValidObjectId;

class UserController {
  async getUser(req, res) {
    try {
      const userId = req.user._id;
      if (!mongooseValidObjectId(userId)) {
        return res
          .status(STATUS_CODES.BAD_REQUEST)
          .json(new apiError("Invalid user ID", STATUS_CODES.BAD_REQUEST));
      }

      const user = await User.findById(userId).select(
        "-password -__v -forgotPasswordToken -forgotPasswordExpiry -fbId"
      );

      if (!user) {
        return res
          .status(STATUS_CODES.NOT_FOUND)
          .json(new apiError("User not found", STATUS_CODES.NOT_FOUND));
      }

      return res
        .status(STATUS_CODES.OK)
        .json(
          new apiResponse(STATUS_CODES.OK, user, "User found successfully")
        );
    } catch (error) {
      return res
        .status(STATUS_CODES.INTERNAL_SERVER_ERROR)
        .json(new apiError(error.message, STATUS_CODES.INTERNAL_SERVER_ERROR));
    }
  }

  async updateUser(req, res) {
    try {
      const { fullName } = req.body;
      const file = req?.file?.path;
      const userId = req.user._id;

      if (!mongooseValidObjectId(userId)) {
        return res
          .status(STATUS_CODES.BAD_REQUEST)
          .json(new apiError("Invalid user ID", STATUS_CODES.BAD_REQUEST));
      }

      const { error } = updateUserValidation(req.body);

      if (error) {
        return res
          .status(STATUS_CODES.BAD_REQUEST)
          .json(
            new apiError(error.details[0].message, STATUS_CODES.BAD_REQUEST)
          );
      }

      const user = await User.findById(userId);

      if (file) {
        await deleteImage(user.profilePicture.public_id);

        const uploadPicture = await uploadFile(file);

        if (!uploadPicture) {
          return res
            .status(STATUS_CODES.INTERNAL_SERVER_ERROR)
            .json(
              new apiError(
                "Failed to upload new profile picture",
                STATUS_CODES.INTERNAL_SERVER_ERROR
              )
            );
        }

        const updatedUser = await User.findByIdAndUpdate(
          userId,
          {
            fullName: fullName || user.fullName,
            profilePicture: {
              public_id:
                uploadPicture.publicId || user.profilePicture.public_id,
              url: uploadPicture.url || user.profilePicture.url,
            },
          },
          {
            new: true,
          }
        );

        if (!updatedUser) {
          return res
            .status(STATUS_CODES.NOT_FOUND)
            .json(new apiError("User not found", STATUS_CODES.NOT_FOUND));
        }

        return res
          .status(STATUS_CODES.OK)
          .json(
            new apiResponse(STATUS_CODES.OK, {}, "User updated successfully")
          );
      } else {
        const updatedUser = await User.findByIdAndUpdate(
          userId,
          {
            fullName: fullName || user.fullName,
          },
          {
            new: true,
          }
        );

        if (!updatedUser) {
          return res
            .status(STATUS_CODES.NOT_FOUND)
            .json(new apiError("User update failed", STATUS_CODES.NOT_FOUND));
        }

        return res
          .status(STATUS_CODES.OK)
          .json(
            new apiResponse(STATUS_CODES.OK, {}, "User updated successfully")
          );
      }
    } catch (error) {
      return res
        .status(STATUS_CODES.INTERNAL_SERVER_ERROR)
        .json(new apiError(error.message, STATUS_CODES.INTERNAL_SERVER_ERROR));
    }
  }

  async changePassword(req, res) {
    try {
      const userId = req.user.id;
      const { oldPassword, newPassword, confirmPassword } = req.body;

      // Ensure new password and confirmation match
      if (newPassword !== confirmPassword) {
        return res
          .status(STATUS_CODES.BAD_REQUEST)
          .json(
            new apiError(
              "Password and confirm password is not same",
              STATUS_CODES.BAD_REQUEST
            )
          );
      }

      // Fetch the user by ID
      const finduser = await User.findById(userId);

      // Verify the old password
      const comparePassword = await finduser.comparePassword(oldPassword);

      if (!comparePassword) {
        return res
          .status(STATUS_CODES.BAD_REQUEST)
          .json(
            new apiError("Old password is incorrect", STATUS_CODES.BAD_REQUEST)
          );
      }

      // Update the user's password
      finduser.password = confirmPassword;
      await finduser.save({ validateBeforeSave: false });

      // Respond with success
      return res
        .status(STATUS_CODES.OK)
        .json(
          new apiResponse(STATUS_CODES.OK, {}, "Password changed successfully")
        );
    } catch (error) {
      return res
        .status(STATUS_CODES.INTERNAL_SERVER_ERROR)
        .json(new apiError(error.message, STATUS_CODES.INTERNAL_SERVER_ERROR));
    }
  }

  async deleteAccount(req, res) {
    try {
      const userId = req.user._id;
      const user = await User.findById(userId);
      if (!user) {
        return res
          .status(STATUS_CODES.NOT_FOUND)
          .json(new apiError("User not found", STATUS_CODES.NOT_FOUND));
      }
      user.isDeleted = true;
      await user.save({ validateBeforeSave: false });

      const options = {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        expires: new Date(0),
      };
      return res
        .clearCookie("accessToken", options)
        .clearCookie("refreshToken", options)
        .status(STATUS_CODES.OK)
        .json(
          new apiResponse(STATUS_CODES.OK, {}, "User deleted successfully")
        );
    } catch (error) {
      return res
        .status(STATUS_CODES.INTERNAL_SERVER_ERROR)
        .json(new apiError(error.message, STATUS_CODES.INTERNAL_SERVER_ERROR));
    }
  }

  async myCourses(req, res) {
    try {
      const userId = req.user.id;
      const courses = await Course.find({ students: { $in: [userId] } });
      if (!courses) {
        return res
          .status(STATUS_CODES.NOT_FOUND)
          .json(new apiError("User not found", STATUS_CODES.NOT_FOUND));
      }
      return res
        .status(STATUS_CODES.OK)
        .json(new apiResponse(STATUS_CODES.OK, courses, "Courses found"));
    } catch (error) {
      return res
        .status(STATUS_CODES.INTERNAL_SERVER_ERROR)
        .json(new apiError(error.message, STATUS_CODES.INTERNAL_SERVER_ERROR));
    }
  }
}

module.exports = new UserController();
