const Course = require("../../../models/courseModel.js");
const User = require("../../../models/userModel.js");
const Order = require("../../../models/orderModel.js");
const apiResponse = require("../../../config/apiResponse.js");
const apiError = require("../../../config/apiError.js");
const STATUS_CODES = require("../../../config/httpStatusCodes.js");
const {
  createLectureValidation,
} = require("../../../helpers/validation/admin/adminValidator.js");
const sendEmail = require("../../../helpers/sendEmail.js");

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
            orderStatus: "completed",
          }),
        ]);

      const currentDate = new Date();
      const firstDayOfWeek = new Date(
        currentDate.setDate(currentDate.getDate() - currentDate.getDay())
      );
      firstDayOfWeek.setHours(0, 0, 0, 0);

      const calculatedCourseDataOfWeek = await Course.aggregate([
        {
          $match: {
            createdAt: { $gte: firstDayOfWeek },
          },
        },
        {
          $group: {
            _id: { $dayOfWeek: "$createdAt" },
            courseCount: { $sum: 1 },
          },
        },
        {
          $sort: { _id: 1 },
        },
        {
          $project: {
            _id: 0,
            dayOfWeek: "$_id",
            courseCount: 1,
          },
        },
      ]);

      if (!calculatedCourseDataOfWeek) {
        return res
          .status(STATUS_CODES.INTERNAL_SERVER_ERROR)
          .json(
            new apiError(
              "Failed to calculate course data",
              STATUS_CODES.INTERNAL_SERVER_ERROR
            )
          );
      }

      const calculatedOrderDataOfWeek = await Order.aggregate([
        {
          $match: {
            createdAt: { $gte: firstDayOfWeek },
          },
        },
        {
          $group: {
            _id: { $dayOfWeek: "$createdAt" },
            courseCount: { $sum: 1 },
          },
        },
        {
          $sort: { _id: 1 },
        },
        {
          $project: {
            _id: 0,
            dayOfWeek: "$_id",
            courseCount: 1,
          },
        },
      ]);

      if (!calculatedOrderDataOfWeek) {
        return res
          .status(STATUS_CODES.INTERNAL_SERVER_ERROR)
          .json(
            new apiError(
              "Failed to calculate order data",
              STATUS_CODES.INTERNAL_SERVER_ERROR
            )
          );
      }

      const result = {
        totalUsers,
        totalInstructors,
        totalCourses,
        totalOrders,
        courseCreationCountOfWeek: calculatedCourseDataOfWeek,
        orderCountOfWeek: calculatedOrderDataOfWeek,
      };

      return res
        .status(STATUS_CODES.OK)
        .json(
          new apiResponse(
            STATUS_CODES.OK,
            { result },
            "Dashboard data fetched successfully"
          )
        );
    } catch (error) {
      return res
        .status(STATUS_CODES.INTERNAL_SERVER_ERROR)
        .json(new apiError(error.message, STATUS_CODES.INTERNAL_SERVER_ERROR));
    }
  }

  async createLecture(req, res) {
    try {
      const { fullName, email, password } = req.body;

      const { error } = createLectureValidation(req.body);

      if (error) {
        return res
          .status(STATUS_CODES.BAD_REQUEST)
          .json(
            new apiError(error.details[0].message, STATUS_CODES.BAD_REQUEST)
          );
      }

      const checkUser = await User.findOne({ email: email });

      if (checkUser) {
        return res
          .status(STATUS_CODES.BAD_REQUEST)
          .json(new apiError("Email already exists", STATUS_CODES.BAD_REQUEST));
      }

      const createUser = await User.create({
        fullName: fullName,
        email: email,
        password: password,
        role: "instructor",
        isVerified: true,
      });

      if (!createUser) {
        return res
          .status(STATUS_CODES.INTERNAL_SERVER_ERROR)
          .json(
            new apiError(
              "Failed to create user",
              STATUS_CODES.INTERNAL_SERVER_ERROR
            )
          );
      }

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
      <h2 style="color: #4caf50">Welcome to LMS App 🎉</h2>
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
        You can log in here:
        <a href=${process.env.SEND_EMAIL_LECTURER} style="color: #4caf50">${process.env.SEND_EMAIL_LECTURER}</a>
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

        return res
          .status(STATUS_CODES.OK)
          .json(
            new apiResponse(STATUS_CODES.OK, {}, "User created successfully")
          );
      } catch (error) {
        return res
          .status(STATUS_CODES.INTERNAL_SERVER_ERROR)
          .json(
            new apiError(error.message, STATUS_CODES.INTERNAL_SERVER_ERROR)
          );
      }
    } catch (error) {
      return res
        .status(STATUS_CODES.INTERNAL_SERVER_ERROR)
        .json(new apiError(error.message, STATUS_CODES.INTERNAL_SERVER_ERROR));
    }
  }

  async getAllUsers(_, res) {
    try {
      const users = await User.find({
        $or: [{ role: "user" }, { role: "instructor" }],
      })
        .select(
          "-password -__v -forgotPasswordToken -forgotPasswordExpiry -fbId"
        )
        .sort({ createdAt: -1 });

      if (!users) {
        return res
          .status(STATUS_CODES.NOT_FOUND)
          .json(new apiError("User not found", STATUS_CODES.NOT_FOUND));
      }
      return res
        .status(STATUS_CODES.OK)
        .json(
          new apiResponse(STATUS_CODES.OK, users, "User found successfully")
        );
    } catch (error) {
      return res
        .status(STATUS_CODES.INTERNAL_SERVER_ERROR)
        .json(new apiError(error.message, STATUS_CODES.INTERNAL_SERVER_ERROR));
    }
  }

  async getAllCourses(_, res) {
    try {
      const courses = await Course.aggregate([
        {
          $lookup: {
            from: "user",
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
        return res
          .status(STATUS_CODES.NOT_FOUND)
          .json(new apiError("Course not found", STATUS_CODES.NOT_FOUND));
      }
      return res
        .status(STATUS_CODES.OK)
        .json(
          new apiResponse(STATUS_CODES.OK, courses, "Course found successfully")
        );
    } catch (error) {
      return res
        .status(STATUS_CODES.INTERNAL_SERVER_ERROR)
        .json(new apiError(error.message, STATUS_CODES.INTERNAL_SERVER_ERROR));
    }
  }

  async getAllOrders(_, res) {
    try {
      const orders = await Order.aggregate([
        {
          $lookup: {
            from: "user",
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
            from: "user",
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
            from: "course",
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
        return res
          .status(STATUS_CODES.NOT_FOUND)
          .json(new apiError("Order not found", STATUS_CODES.NOT_FOUND));
      }
      return res
        .status(STATUS_CODES.OK)
        .json(
          new apiResponse(STATUS_CODES.OK, orders, "Order found successfully")
        );
    } catch (error) {
      return res
        .status(STATUS_CODES.INTERNAL_SERVER_ERROR)
        .json(new apiError(error.message, STATUS_CODES.INTERNAL_SERVER_ERROR));
    }
  }
}

module.exports = new AdminController();
