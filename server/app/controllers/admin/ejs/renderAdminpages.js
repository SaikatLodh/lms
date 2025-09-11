const Course = require("../../../models/courseModel.js");
const User = require("../../../models/userModel.js");
const Order = require("../../../models/orderModel.js");
const Notification = require("../../../models/notificationModel.js");
const ContactSupport = require("../../../models/contactSupportModel.js");
const {
  createLectureValidation,
} = require("../../../helpers/validation/admin/adminValidator.js");
const {
  updateUserValidation,
} = require("../../../helpers/validation/user/userValidation");
const sendEmail = require("../../../helpers/sendEmail.js");
const { deleteImage, uploadFile } = require("../../../helpers/cloudinary.js");
const mongooseValidObjectId = require("mongoose").isValidObjectId;

class AdminController {
  async getDashboardData(req, res) {
    try {
      const [totalUsers, totalInstructors, totalCourses, totalOrders] =
        await Promise.all([
          User.countDocuments({
            role: "user",
            isDeleted: false,
          }),
          User.countDocuments({
            role: "instructor",
            isDeleted: false,
          }),
          Course.countDocuments({ isDeleted: false }),
          Order.countDocuments({
            orderStatus: "paid",
          }),
        ]);

      const currentDate = new Date();
      const firstDayOfWeek = new Date(
        currentDate.setDate(currentDate.getDate() - currentDate.getDay())
      );

      firstDayOfWeek.setHours(0, 0, 0, 0);

      const oneYearAgo = new Date();
      oneYearAgo.setFullYear(oneYearAgo.getFullYear() - 1);

      const calculatedCourseDataOfYear = await Course.aggregate([
        {
          $match: {
            createdAt: { $gte: oneYearAgo },
            isDeleted: false,
          },
        },
        {
          $group: {
            _id: {
              year: { $year: "$createdAt" },
              month: { $month: "$createdAt" },
              day: { $dayOfMonth: "$createdAt" },
            },
            courseCount: { $sum: 1 },
          },
        },
        {
          $sort: { "_id.year": 1, "_id.month": 1, "_id.day": 1 },
        },
        {
          $project: {
            _id: 0,
            year: "$_id.year",
            month: "$_id.month",
            day: "$_id.day",
            courseCount: 1,
          },
        },
      ]);

      if (!calculatedCourseDataOfYear) {
        req.flash("error", "Failed to calculate course data");
        return res.redirect("/");
      }

      const calculatedOrderDataOfWeek = await Order.aggregate([
        {
          $match: {
            createdAt: { $gte: firstDayOfWeek },
            orderStatus: "paid",
          },
        },
        {
          $group: {
            _id: { $dayOfWeek: "$createdAt" },
            orderCount: { $sum: 1 },
          },
        },
        {
          $sort: { _id: 1 },
        },
        {
          $project: {
            _id: 0,
            dayOfWeek: "$_id",
            orderCount: 1,
          },
        },
      ]);

      if (!calculatedOrderDataOfWeek) {
        req.flash("error", "Failed to calculate order data");
        return res.redirect("/");
      }

      const notifications = await Notification.find({
        receiverId: req.user._id,
        messageType: "admin",
      })
        .populate({
          path: "senderId",
          select: "fullName profilePicture gooleavatar faceBookavatar",
        })
        .select("-__v")
        .sort({ createdAt: -1 });

      const result = {
        totalUsers,
        totalInstructors,
        totalCourses,
        totalOrders,
        courseCreationCountOfYear: calculatedCourseDataOfYear,
        orderCountOfWeek: calculatedOrderDataOfWeek,
        email: req.user.email,
        role: req.user.role,
        fullName: req.user.fullName,
        profilePicture: req.user.profilePicture.url,
      };

      return res.render("index", {
        result,
        notifications,
        user: req.user,
        title: "Dashboard",
        success: req.flash("success"),
        error: req.flash("error"),
      });
    } catch (error) {
      req.flash("error", error.message);
      return res.redirect("/");
    }
  }

  async renderCreateLecture(req, res) {
    try {
      const notifications = await Notification.find({
        receiverId: req.user._id,
        messageType: "admin",
      })
        .populate({
          path: "senderId",
          select: "fullName profilePicture gooleavatar faceBookavatar",
        })
        .select("-__v")
        .sort({ createdAt: -1 });
      return res.render("create-lecture", {
        title: "Create Lecture",
        notifications,
        user: req.user,
        error: req.flash("error"),
        success: req.flash("success"),
      });
    } catch (error) {
      req.flash("error", error.message);
      return res.redirect("/");
    }
  }

  async createLecture(req, res) {
    try {
      const { fullName, email, password } = req.body;

      const { error } = createLectureValidation(req.body);

      if (error) {
        req.flash("error", error.details[0].message);
        return res.redirect("/createlecture");
      }

      const checkUser = await User.findOne({ email: email });

      if (checkUser) {
        req.flash("error", "Email already exists");
        return res.redirect("/createlecture");
      }

      const createUser = await User.create({
        fullName: fullName,
        email: email,
        password: password,
        role: "instructor",
        isVerified: true,
      });

      if (!createUser) {
        req.flash("error", "Failed to create user");
        return res.redirect("/createlecture");
      }
      const frontendUrl = process.env.SEND_EMAIL_LECTURER;
      const options = {
        email: email,
        subject:
          "Your account is created successfully! Please verify your email address to login.",
        message: `
          <!DOCTYPE html>
<html>
  <body style="font-family: Arial, sans-serif; color: #333">
    <div
      style="
        max-width: 600px;
        margin: auto;
        padding: 20px;
        border: 1px solid #eee;
        border-radius: 8px;
      "
    >
      <h2 style="color: #4caf50">Welcome to LMS ACADEMY 🎉</h2>
      <p>Dear <strong>${fullName}</strong>,</p>
      <p>
        Your account has been successfully created. Below are your login
        credentials:
      </p>

      <div
        style="
          background: #f9f9f9;
          padding: 15px;
          border-radius: 6px;
          border: 1px solid #ddd;
        "
      >
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Password:</strong> ${password}</p>
      </div>

      <p style="color: #d9534f; font-size: 14px">
        <strong>Important:</strong> Please change your password after your first
        login to keep your account secure.
      </p>

      <p>
        You can log in here:<a href="${frontendUrl}" style="color: #4caf50">${frontendUrl}</a>
      </p>

      <p>
        Thank you,<br />
        <strong>LMS App Team</strong>
      </p>
    </div>
  </body>
</html>
`,
      };

      try {
        await sendEmail(options);

        req.flash("success", "User created successfully");
        return res.redirect("/createlecture");
      } catch (error) {
        req.flash("error", error.message);
        return res.redirect("/createlecture");
      }
    } catch (error) {
      req.flash("error", error.message);
      return res.redirect("/createlecture");
    }
  }

  async getAllUsers(req, res) {
    try {
      const users = await User.find({
        isDeleted: false,
        $or: [{ role: "user" }, { role: "instructor" }],
      })
        .select(
          "-password -__v -forgotPasswordToken -forgotPasswordExpiry -fbId"
        )
        .sort({ createdAt: -1 });

      if (!users) {
        req.flash("error", "Failed to get users");
        return res.redirect("/users");
      }

      const notifications = await Notification.find({
        receiverId: req.user._id,
        messageType: "admin",
      })
        .populate({
          path: "senderId",
          select: "fullName profilePicture gooleavatar faceBookavatar",
        })
        .select("-__v")
        .sort({ createdAt: -1 });

      return res.render("users", {
        users,
        notifications,
        user: req.user,
        title: "Users",
        success: req.flash("success"),
        error: req.flash("error"),
      });
    } catch (error) {
      req.flash("error", error.message);
      return res.redirect("/users");
    }
  }

  async getAllCourses(req, res) {
    try {
      const courses = await Course.aggregate([
        {
          $match: {
            isDeleted: false,
          },
        },
        {
          $lookup: {
            from: "users",
            localField: "instructorId",
            foreignField: "_id",
            as: "instructor",
          },
        },
        {
          $unwind: {
            path: "$instructor",
            preserveNullAndEmptyArrays: true,
          },
        },
        {
          $project: {
            __v: 0,
            "instructor.password": 0,
            "instructor.forgotPasswordToken": 0,
            "instructor.forgotPasswordExpiry": 0,
            "instructor.fbId": 0,
            "instructor.__v": 0,
          },
        },
        {
          $sort: {
            createdAt: -1,
          },
        },
      ]);

      if (!courses) {
        req.flash("error", "Failed to get courses");
        res.redirect("/courses");
      }

      const notifications = await Notification.find({
        receiverId: req.user._id,
        messageType: "admin",
      })
        .populate({
          path: "senderId",
          select: "fullName profilePicture gooleavatar faceBookavatar",
        })
        .select("-__v")
        .sort({ createdAt: -1 });

      return res.render("courses", {
        courses,
        title: "Courses",
        notifications,
        user: req.user,
        success: req.flash("success"),
        error: req.flash("error"),
      });
    } catch (error) {
      req.flash("error", error.message);
      return res.redirect("/courses");
    }
  }

  async getAllOrders(req, res) {
    try {
      const orders = await Order.aggregate([
        {
          $lookup: {
            from: "users",
            localField: "userId",
            foreignField: "_id",
            as: "user",
          },
        },
        {
          $unwind: {
            path: "$user",
            preserveNullAndEmptyArrays: true,
          },
        },
        {
          $project: {
            __v: 0,
            "user.password": 0,
            "user.forgotPasswordToken": 0,
            "user.forgotPasswordExpiry": 0,
            "user.fbId": 0,
            "user.__v": 0,
          },
        },
        {
          $sort: {
            createdAt: -1,
          },
        },
        {
          $lookup: {
            from: "users",
            localField: "instructorId",
            foreignField: "_id",
            as: "lecturer",
          },
        },
        {
          $unwind: {
            path: "$lecturer",
            preserveNullAndEmptyArrays: true,
          },
        },
        {
          $project: {
            __v: 0,
            "user.password": 0,
            "user.forgotPasswordToken": 0,
            "user.forgotPasswordExpiry": 0,
            "user.fbId": 0,
            "user.__v": 0,
          },
        },
        {
          $sort: {
            createdAt: -1,
          },
        },
        {
          $lookup: {
            from: "courses",
            localField: "courseId",
            foreignField: "_id",
            as: "course",
          },
        },
        {
          $unwind: {
            path: "$course",
            preserveNullAndEmptyArrays: true,
          },
        },
        {
          $project: {
            __v: 0,
            "course.__v": 0,
          },
        },
        {
          $sort: {
            createdAt: -1,
          },
        },
      ]);

      if (!orders) {
        req.flash("error", "Failed to get orders");
        return res.redirect("/orders");
      }

      const notifications = await Notification.find({
        receiverId: req.user._id,
        messageType: "admin",
      })
        .populate({
          path: "senderId",
          select: "fullName profilePicture gooleavatar faceBookavatar",
        })
        .select("-__v")
        .sort({ createdAt: -1 });

      return res.render("orders", {
        orders,
        title: "Orders",
        notifications,
        user: req.user,
        success: req.flash("success"),
        error: req.flash("error"),
      });
    } catch (error) {
      req.flash("error", error.message);
      return res.redirect("/orders");
    }
  }

  async getContactSupport(req, res) {
    try {
      const contactSupports = await ContactSupport.find({})
        .populate({
          path: "userId",
          select:
            "-password -__v -forgotPasswordToken -forgotPasswordExpiry -fbId",
        })
        .sort({
          createdAt: -1,
        });
      if (!contactSupports) {
        req.flash("error", "Failed to get contact support");
        return res.redirect("/contactsupport");
      }

      const notifications = await Notification.find({
        receiverId: req.user._id,
        messageType: "admin",
      })
        .populate({
          path: "senderId",
          select: "fullName profilePicture gooleavatar faceBookavatar",
        })
        .select("-__v")
        .sort({ createdAt: -1 });

      return res.render("contact-support", {
        title: "Contact",
        contactSupports,
        notifications,
        user: req.user,
        success: req.flash("success"),
        error: req.flash("error"),
      });
    } catch (error) {
      req.flash("error", error.message);
      return res.redirect("/contactsupport");
    }
  }

  async renderUpdateProfile(req, res) {
    try {
      const userId = req.user._id;
      const findUser = await User.findById(userId);

      if (!findUser) {
        req.flash("error", "Failed to get user");
        return res.redirect("/profile");
      }
      const notifications = await Notification.find({
        receiverId: req.user._id,
        messageType: "admin",
      })
        .populate({
          path: "senderId",
          select: "fullName profilePicture gooleavatar faceBookavatar",
        })
        .select("-__v")
        .sort({ createdAt: -1 });

      return res.render("update-profile", {
        title: "Profile",
        email: findUser.email,
        notifications,
        user: req.user,
        success: req.flash("success"),
        error: req.flash("error"),
      });
    } catch (error) {
      req.flash("error", error.message);
      return res.redirect("/profile");
    }
  }

  async updateProfile(req, res) {
    try {
      const { fullName } = req.body;
      const file = req?.file?.path;
      const userId = req.user._id;

      if (!mongooseValidObjectId(userId)) {
        req.flash("error", "Invalid user id");
        return res.redirect("/updateprofile");
      }

      const { error } = updateUserValidation(req.body);

      if (error) {
        req.flash("error", error.details[0].message);
        return res.redirect("/updateprofile");
      }

      const user = await User.findById(userId);

      if (file) {
        await deleteImage(user.profilePicture.public_id);

        const uploadPicture = await uploadFile(file);

        if (!uploadPicture) {
          req.flash("error", "Failed to upload new profile picture");
          return res.redirect("/updateprofile");
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
          req.flash("error", "User not found");
          return res.redirect("/updateprofile");
        }

        req.flash("success", "Profile updated successfully");
        return res.redirect("/updateprofile");
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
          req.flash("error", "User update failed");
          return res.redirect("/updateprofile");
        }

        req.flash("success", "Profile updated successfully");
        return res.redirect("/updateprofile");
      }
    } catch (error) {
      req.flash("error", error.message);
      return res.redirect("/updateprofile");
    }
  }

  async renderChangePassword(req, res) {
    try {
      const notifications = await Notification.find({
        receiverId: req.user._id,
        messageType: "admin",
      })
        .populate({
          path: "senderId",
          select: "fullName profilePicture gooleavatar faceBookavatar",
        })
        .select("-__v")
        .sort({ createdAt: -1 });
      return res.render("change-password", {
        title: "Change Password",
        notifications,
        user: req.user,
        success: req.flash("success"),
        error: req.flash("error"),
      });
    } catch (error) {
      req.flash("error", error.message);
      return res.redirect("/change-password");
    }
  }

  async changePassword(req, res) {
    try {
      const userId = req.user.id;
      const { oldPassword, newPassword, confirmPassword } = req.body;

      if (newPassword !== confirmPassword) {
        req.flash("error", "Password and confirm password is not same");
        return res.redirect("/changepassword");
      }

      const finduser = await User.findById(userId);

      const comparePassword = await finduser.comparePassword(oldPassword);

      if (!comparePassword) {
        req.flash("error", "Old password is incorrect");
        return res.redirect("/changepassword");
      }

      finduser.password = newPassword;
      await finduser.save({ validateBeforeSave: false });

      req.flash("success", "Password changed successfully");
      return res.redirect("/changepassword");
    } catch (error) {
      req.flash("error", error.message);
      return res.redirect("/changepassword");
    }
  }

  async seenNotification(req, res) {
    try {
      const notificationId = req.params.id;

      const notification = await Notification.findOneAndUpdate(
        { _id: notificationId },
        { seen: true },
        { new: true }
      );

      if (!notification) {
        req.flash("error", "Some error occurred when updating");
      }
    } catch (error) {
      req.flash("error", error.message);
      return res.redirect("/notification");
    }
  }
}

module.exports = new AdminController();
