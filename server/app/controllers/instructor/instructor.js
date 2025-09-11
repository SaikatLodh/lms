const Course = require("../../models/courseModel.js");
const Order = require("../../models/orderModel.js");
const apiResponse = require("../../config/apiResponse.js");
const apiError = require("../../config/apiError.js");
const STATUS_CODES = require("../../config/httpStatusCodes.js");

class InstructorController {
  async getInstructorDashboard(req, res) {
    try {
      const instructorId = req.user._id;
      const [totalCourses, totalStudents, totalOrders, totalEarnings] =
        await Promise.all([
          Course.countDocuments({
            instructorId: instructorId,
            isDeleted: false,
          }),
          Course.aggregate([
            { $match: { instructorId: instructorId, isDeleted: false } },
            { $unwind: "$students" },
            { $group: { _id: "$students" } },
            { $count: "totalStudents" },
          ]),
          Order.countDocuments({ instructorId }),
          Order.aggregate([
            { $match: { instructorId: instructorId } },
            {
              $group: {
                _id: null,
                totalEarnings: { $sum: "$totalAmount" },
              },
            },
          ]),
        ]);

      const currentDate = new Date();
      const firstDayOfWeek = new Date(
        currentDate.setDate(currentDate.getDate() - currentDate.getDay())
      );

      firstDayOfWeek.setHours(0, 0, 0, 0);

      const oneYearAgo = new Date();
      oneYearAgo.setFullYear(oneYearAgo.getFullYear() - 1);

      const calculatedCourseByyear = await Course.aggregate([
        {
          $match: {
            createdAt: { $gte: oneYearAgo },
            instructorId: instructorId,
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

      if (!calculatedCourseByyear) {
        return res
          .status(STATUS_CODES.INTERNAL_SERVER_ERROR)
          .json(
            new apiError(
              "Failed to calculate course data",
              STATUS_CODES.INTERNAL_SERVER_ERROR
            )
          );
      }

      const totalEarningsOfyWeek = await Order.aggregate([
        {
          $match: {
            createdAt: { $gte: firstDayOfWeek },
            instructorId: instructorId,
          },
        },
        {
          $group: {
            _id: { $dayOfWeek: "$createdAt" },
            totalEarnings: { $sum: "$totalAmount" },
          },
        },
        {
          $project: {
            _id: 0,
            dayOfWeek: "$_id",
            totalEarnings: 1,
          },
        },
      ]);

      if (!totalEarningsOfyWeek) {
        return res
          .status(STATUS_CODES.INTERNAL_SERVER_ERROR)
          .json(
            new apiError(
              "Failed to calculate course data",
              STATUS_CODES.INTERNAL_SERVER_ERROR
            )
          );
      }

      const result = {
        totalCourses: totalCourses,
        totalStudents:
          totalStudents.length > 0 ? totalStudents[0].totalStudents : 0,
        totalOrders: totalOrders,
        totalEarnings: totalEarnings.reduce((a, b) => a + b.totalEarnings, 0),
        calculatedCourseByyear: calculatedCourseByyear,
        totalEarningsOfyWeek: totalEarningsOfyWeek,
      };
      return res
        .status(STATUS_CODES.OK)
        .json(new apiResponse(STATUS_CODES.OK, result, "Success"));
    } catch (error) {
      return res
        .status(STATUS_CODES.INTERNAL_SERVER_ERROR)
        .json(new apiError(error.message, STATUS_CODES.INTERNAL_SERVER_ERROR));
    }
  }

  async getInstructorCourse(req, res) {
    try {
      const instructorId = req.user._id;

      const course = await Course.aggregate([
        {
          $match: {
            instructorId: instructorId,
            isDeleted: false,
          },
        },
        {
          $lookup: {
            from: "users",
            localField: "students",
            foreignField: "_id",
            as: "user",
          },
        },
        {
          $project: {
            title: 1,
            description: 1,
            price: 1,
            category: 1,
            thumbnail: 1,
            createdAt: 1,
            updatedAt: 1,
            "user.fullName": 1,
            "user.email": 1,
            "user.profilePicture": 1,
            "user.gooleavatar": 1,
            "user.faceBookavatar": 1,
          },
        },
      ]);

      if (!course) {
        return res
          .status(STATUS_CODES.NOT_FOUND)
          .json(new apiError("Course not found", STATUS_CODES.NOT_FOUND));
      }

      return res
        .status(STATUS_CODES.OK)
        .json(new apiResponse(STATUS_CODES.OK, course, "Success"));
    } catch (error) {
      return res
        .status(STATUS_CODES.INTERNAL_SERVER_ERROR)
        .json(new apiError(error.message, STATUS_CODES.INTERNAL_SERVER_ERROR));
    }
  }

  async getInstructororderOrders(req, res) {
    try {
      const instructorId = req.user._id;

      const orders = await Order.aggregate([
        {
          $match: {
            instructorId: instructorId,
            orderStatus: "paid",
          },
        },
        {
          $lookup: {
            from: "users",
            localField: "userId",
            foreignField: "_id",
            as: "users",
          },
        },
        {
          $unwind: {
            path: "$users",
            preserveNullAndEmptyArrays: true,
          },
        },
        {
          $lookup: {
            from: "courses",
            localField: "courseId",
            foreignField: "_id",
            as: "courses",
          },
        },
        {
          $unwind: {
            path: "$courses",
            preserveNullAndEmptyArrays: true,
          },
        },
        {
          $sort: {
            createdAt: -1,
          },
        },

        {
          $project: {
            _id: 1,
            totalAmount: 1,
            orderStatus: 1,
            createdAt: 1,
            updatedAt: 1,
            "users.fullName": 1,
            "users.email": 1,
            "users.profilePicture": 1,
            "users.gooleavatar": 1,
            "users.faceBookavatar": 1,
            "courses.title": 1,
            "courses.category": 1,
            "courses.image": 1,
            "courses.pricing": 1,
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
        .json(new apiResponse(STATUS_CODES.OK, orders, "Success"));
    } catch (error) {
      return res
        .status(STATUS_CODES.INTERNAL_SERVER_ERROR)
        .json(new apiError(error.message, STATUS_CODES.INTERNAL_SERVER_ERROR));
    }
  }
}

module.exports = new InstructorController();
