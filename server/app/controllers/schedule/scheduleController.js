const Schedule = require("../../models/scheduleNodel");
const Notification = require("../../models/notificationModel");
const Course = require("../../models/courseModel");
const apiResponse = require("../../config/apiResponse");
const apiError = require("../../config/apiError");
const STATUS_CODES = require("../../config/httpStatusCodes");
const {
  createScheduleValidation,
  updateScheduleValidation,
} = require("../../helpers/validation/schedule/scheduleValidator");
const mongooseValidObjectId = require("mongoose").isValidObjectId;
const redis = require("../../config/redis");
const { SCHEDULE } = require("../../config/redisKey");
const { userSocketIDs, getIO } = require("../../config/socketStore");
const { NOTIFICATION } = require("../../config/socketKeys");

class ScheduleController {
  async createSchedule(req, res) {
    try {
      const { courseId, instuctorId, reason, date, time } = req.body;
      const userId = req.user._id;

      if (!mongooseValidObjectId(userId)) {
        return res
          .status(STATUS_CODES.BAD_REQUEST)
          .json(new apiError("Invalid user id", STATUS_CODES.BAD_REQUEST));
      }

      const { error } = createScheduleValidation(req.body);

      if (error) {
        return res
          .status(STATUS_CODES.BAD_REQUEST)
          .json(
            new apiError(error.details[0].message, STATUS_CODES.BAD_REQUEST)
          );
      }

      const schedule = await Schedule.create({
        userId,
        courseId,
        instuctorId,
        reason,
        date,
        time,
      });

      if (!schedule) {
        return res
          .status(STATUS_CODES.INTERNAL_SERVER_ERROR)
          .json(
            new apiError(
              "Schedule not created",
              STATUS_CODES.INTERNAL_SERVER_ERROR
            )
          );
      }

      const getScheduleFromRedis = await redis.get(`${SCHEDULE}:${userId}`);

      if (getScheduleFromRedis) {
        await redis.del(`${SCHEDULE}:${userId}`);
      }

      const getCourse = await Course.findById(courseId);

      const createNotification = await Notification.create({
        senderId: userId,
        receiverId: instuctorId,
        title: `${req.user.fullName} created a schedule`,
        message: `${req.user.fullName} created a schedule for ${getCourse.title}`,
        messageType: "instructor",
      });

      const getNotification = await Notification.findById(
        createNotification._id
      ).populate({
        path: "senderId",
        select: "fullName profilePicture gooleavatar faceBookavatar",
      });

      const getSocketId = userSocketIDs.get(instuctorId.toString());
      const io = getIO();

      if (getSocketId && getNotification) {
        io.to(getSocketId).emit(NOTIFICATION, getNotification);
      }

      return res
        .status(STATUS_CODES.CREATED)
        .json(new apiResponse(STATUS_CODES.CREATED, {}, "Schedule created"));
    } catch (err) {
      return res
        .status(STATUS_CODES.INTERNAL_SERVER_ERROR)
        .json(new apiError(err.message, STATUS_CODES.INTERNAL_SERVER_ERROR));
    }
  }

  async getSchedule(req, res) {
    try {
      const userId = req.user._id;

      if (!mongooseValidObjectId(userId)) {
        return res
          .status(STATUS_CODES.BAD_REQUEST)
          .json(new apiError("Invalid user id", STATUS_CODES.BAD_REQUEST));
      }

      const getScheduleFromRedis = await redis.get(`${SCHEDULE}:${userId}`);

      if (getScheduleFromRedis) {
        return res
          .status(STATUS_CODES.OK)
          .json(
            new apiResponse(
              STATUS_CODES.OK,
              JSON.parse(getScheduleFromRedis),
              "Schedule found successfully"
            )
          );
      }

      const schedule = await Schedule.aggregate([
        { $match: { $or: [{ userId: userId }, { instuctorId: userId }] } },
        { $sort: { createdAt: -1 } },
        {
          $lookup: {
            from: "courses",
            localField: "courseId",
            foreignField: "_id",
            as: "course",
          },
        },
        { $unwind: { path: "$course", preserveNullAndEmptyArrays: true } },
      ]);

      if (!schedule) {
        return res
          .status(STATUS_CODES.INTERNAL_SERVER_ERROR)
          .json(
            new apiError(
              "Schedule not found",
              STATUS_CODES.INTERNAL_SERVER_ERROR
            )
          );
      }

      await redis.set(
        `${SCHEDULE}:${userId}`,
        JSON.stringify(schedule),
        "EX",
        180
      );

      return res
        .status(STATUS_CODES.OK)
        .json(new apiResponse(STATUS_CODES.OK, schedule, "Schedule found"));
    } catch (error) {
      return res
        .status(STATUS_CODES.INTERNAL_SERVER_ERROR)
        .json(new apiError(error.message, STATUS_CODES.INTERNAL_SERVER_ERROR));
    }
  }

  async getSingleSchedule(req, res) {
    try {
      const { scheduleId } = req.params;
      const userId = req.user._id;

      if (!mongooseValidObjectId(userId)) {
        return res
          .status(STATUS_CODES.BAD_REQUEST)
          .json(new apiError("Invalid user id", STATUS_CODES.BAD_REQUEST));
      }

      const getSingleScheduleFromRedis = await redis.get(
        `${SCHEDULE}:${userId}:${scheduleId}`
      );

      if (getSingleScheduleFromRedis) {
        return res
          .status(STATUS_CODES.OK)
          .json(
            new apiResponse(
              STATUS_CODES.OK,
              JSON.parse(getSingleScheduleFromRedis),
              "Schedule found successfully"
            )
          );
      }

      const schedule = await Schedule.findById(scheduleId).populate({
        path: "courseId",
      });

      if (!schedule) {
        return res
          .status(STATUS_CODES.INTERNAL_SERVER_ERROR)
          .json(
            new apiError(
              "Schedule not found",
              STATUS_CODES.INTERNAL_SERVER_ERROR
            )
          );
      }

      await redis.set(
        `${SCHEDULE}:${userId}:${scheduleId}`,
        JSON.stringify(schedule),
        "EX",
        180
      );

      return res
        .status(STATUS_CODES.OK)
        .json(new apiResponse(STATUS_CODES.OK, schedule, "Schedule found"));
    } catch (error) {
      return res
        .status(STATUS_CODES.INTERNAL_SERVER_ERROR)
        .json(new apiError(error.message, STATUS_CODES.INTERNAL_SERVER_ERROR));
    }
  }

  async updateSchedule(req, res) {
    try {
      const { reason, date, time, status } = req.body;
      const { scheduleId } = req.params;
      const userId = req.user._id;

      if (!mongooseValidObjectId(userId)) {
        return res
          .status(STATUS_CODES.BAD_REQUEST)
          .json(new apiError("Invalid user id", STATUS_CODES.BAD_REQUEST));
      }

      const { error } = updateScheduleValidation(req.body);

      if (error) {
        return res
          .status(STATUS_CODES.BAD_REQUEST)
          .json(
            new apiError(error.details[0].message, STATUS_CODES.BAD_REQUEST)
          );
      }

      const getSchedule = await Schedule.findById(scheduleId);

      const updateSchedule = await Schedule.findByIdAndUpdate(
        scheduleId,
        {
          reason: reason || getSchedule.reason,
          date: date || getSchedule.date,
          time: time || getSchedule.time,
          status: status || getSchedule.status,
        },
        { new: true }
      );

      if (!updateSchedule) {
        return res
          .status(STATUS_CODES.INTERNAL_SERVER_ERROR)
          .json(
            new apiError(
              "Schedule not updated",
              STATUS_CODES.INTERNAL_SERVER_ERROR
            )
          );
      }

      const getScheduleFromRedis = await redis.keys(`${SCHEDULE}:${userId}`);
      const getSingleScheduleFromRedis = await redis.get(
        `${SCHEDULE}:${userId}:${scheduleId}`
      );

      if (getScheduleFromRedis) {
        await redis.del(`${SCHEDULE}:${userId}`);
      }

      if (getSingleScheduleFromRedis) {
        await redis.del(`${SCHEDULE}:${userId}:${scheduleId}`);
      }

      if (
        status === "Scheduled" &&
        userId.toString() === getSchedule.instuctorId.toString()
      ) {
        const course = await Course.findById(getSchedule.courseId);

        const createNotification = await Notification.create({
          senderId: userId,
          receiverId: getSchedule.userId,
          title: `You got schedule for ${course.title}`,
          message: `${course.title} scheduled by ${req.user.fullName} for you`,
          messageType: "user",
        });

        const getNotification = await Notification.findById(
          createNotification._id
        ).populate({
          path: "senderId",
          select: "fullName profilePicture gooleavatar faceBookavatar",
        });

        const getSocketId = userSocketIDs.get(getSchedule.userId.toString());
        const io = getIO();

        if (getSocketId && getNotification) {
          io.to(getSocketId).emit(NOTIFICATION, getNotification);
        }
      }

      return res
        .status(STATUS_CODES.OK)
        .json(new apiResponse(STATUS_CODES.OK, {}, "Schedule updated"));
    } catch (error) {
      return res
        .status(STATUS_CODES.INTERNAL_SERVER_ERROR)
        .json(new apiError(error.message, STATUS_CODES.INTERNAL_SERVER_ERROR));
    }
  }

  async liveStatus(req, res) {
    const { scheduleId } = req.params;
    const userId = req.user._id;

    if (!mongooseValidObjectId(scheduleId)) {
      return res
        .status(STATUS_CODES.BAD_REQUEST)
        .json(new apiError("Invalid schedule id", STATUS_CODES.BAD_REQUEST));
    }

    const updateSchedule = await Schedule.findByIdAndUpdate(
      scheduleId,
      { status: "Live" },
      { new: true }
    );

    if (!updateSchedule) {
      return res
        .status(STATUS_CODES.INTERNAL_SERVER_ERROR)
        .json(
          new apiError(
            "Schedule not updated",
            STATUS_CODES.INTERNAL_SERVER_ERROR
          )
        );
    }

    const getScheduleFromRedis = await redis.keys(`${SCHEDULE}:${userId}`);
    const getSingleScheduleFromRedis = await redis.get(
      `${SCHEDULE}:${userId}:${scheduleId}`
    );

    if (getScheduleFromRedis) {
      await redis.del(`${SCHEDULE}:${userId}`);
    }

    if (getSingleScheduleFromRedis) {
      await redis.del(`${SCHEDULE}:${userId}:${scheduleId}`);
    }

    return res
      .status(STATUS_CODES.OK)
      .json(new apiResponse(STATUS_CODES.OK, {}, "Schedule updated"));
  }
}

module.exports = new ScheduleController();
