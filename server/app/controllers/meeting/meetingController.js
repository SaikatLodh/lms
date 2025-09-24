const Meeting = require("../../models/meetingModel");
const Schedule = require("../../models/scheduleModel");
const Notification = require("../../models/notificationModel");
const Course = require("../../models/courseModel");
const User = require("../../models/userModel");
const apiResponse = require("../../config/apiResponse");
const apiError = require("../../config/apiError");
const STATUS_CODES = require("../../config/httpStatusCodes");
const mongooseValidObjectId = require("mongoose").isValidObjectId;
const redis = require("../../config/redis");
const { SCHEDULE } = require("../../config/redisKey");
const bcrypt = require("bcrypt");
const {
  createMeetingValidation,
} = require("../../helpers/validation/meeting/meetingValidator");
const { userSocketIDs, getIO } = require("../../config/socketStore");
const { NOTIFICATION } = require("../../config/socketKeys");
const sendEmail = require("../../helpers/sendEmail");

class MeetingController {
  async createMeeting(req, res) {
    try {
      const {
        courseId,
        userId,
        scheduleId,
        meetingName,
        duration,
        date,
        startTime,
      } = req.body;
      const instructorId = req.user._id;

      const [hours, minutes] = startTime.split(":").map(Number);
      const startMinutes = hours * 60 + minutes;
      const endMinutes = startMinutes + duration;
      const endHours = Math.floor(endMinutes / 60);
      const endMins = endMinutes % 60;
      const endTime = `${endHours.toString().padStart(2, "0")}:${endMins
        .toString()
        .padStart(2, "0")}`;

      if (!mongooseValidObjectId(userId)) {
        return res
          .status(STATUS_CODES.BAD_REQUEST)
          .json(new apiError("Invalid user id", STATUS_CODES.BAD_REQUEST));
      }

      if (!mongooseValidObjectId(instructorId)) {
        return res
          .status(STATUS_CODES.BAD_REQUEST)
          .json(
            new apiError("Invalid instructor id", STATUS_CODES.BAD_REQUEST)
          );
      }

      if (!mongooseValidObjectId(courseId)) {
        return res
          .status(STATUS_CODES.BAD_REQUEST)
          .json(new apiError("Invalid course id", STATUS_CODES.BAD_REQUEST));
      }

      const { error } = createMeetingValidation(req.body);

      if (error) {
        return res
          .status(STATUS_CODES.BAD_REQUEST)
          .json(
            new apiError(error.details[0].message, STATUS_CODES.BAD_REQUEST)
          );
      }

      const roomId = bcrypt.genSaltSync().split("/").join("");
      const meetingUrl = `${roomId}`;

      const meeting = await Meeting.create({
        courseId,
        userId,
        instructorId,
        meetingName,
        duration,
        date,
        startTime,
        endTime,
        roomId,
        meetingUrl,
      });

      if (!meeting) {
        return res
          .status(STATUS_CODES.INTERNAL_SERVER_ERROR)
          .json(
            new apiError(
              "Meeting not created",
              STATUS_CODES.INTERNAL_SERVER_ERROR
            )
          );
      }

      const updateUrlToSchedule = await Schedule.findByIdAndUpdate(
        scheduleId,
        {
          meetingUrl: meeting.meetingUrl,
          meetingId: meeting._id,
        },
        { new: true }
      );

      if (!updateUrlToSchedule) {
        return res
          .status(STATUS_CODES.INTERNAL_SERVER_ERROR)
          .json(
            new apiError(
              "Something went wrong while updating meeting url to schedule",
              STATUS_CODES.INTERNAL_SERVER_ERROR
            )
          );
      }

      const createNotification = await Notification.create({
        senderId: instructorId,
        receiverId: userId,
        title: "Your meeting Link",
        message: `Your meeting hosted in this link ${meetingUrl}`,
        messageType: "user",
      });

      const getNotification = await Notification.findById(
        createNotification._id
      ).populate({
        path: "senderId",
        select: "fullName profilePicture gooleavatar faceBookavatar",
      });

      const getSocketId = userSocketIDs.get(userId.toString());
      const io = getIO();

      if (getSocketId && getNotification) {
        io.to(getSocketId).emit(NOTIFICATION, getNotification);
      }

      const course = await Course.findById(courseId);
      const user = await User.findById(userId);
      const convertodate = meeting.date.toISOString().split("T")[0];
      const temptLate = `<!DOCTYPE html>
<html>
  <head>
    <meta charset="UTF-8" />
    <title>LMS Academy - Video Meeting Invitation</title>
  </head>
  <body style="margin:0; padding:0; font-family: Arial, sans-serif; background-color:#f4f4f4;">
    <table align="center" width="600" cellpadding="0" cellspacing="0" style="background:#ffffff; border-radius:8px; overflow:hidden;">
      <!-- Header -->
      <tr>
        <td style="background:#4F46E5; color:#ffffff; padding:20px; text-align:center; font-size:22px; font-weight:bold;">
          LMS Academy
        </td>
      </tr>

      <!-- Content -->
      <tr>
        <td style="padding:30px; color:#333;">
          <h2 style="margin-top:0;">Hello ${user.fullName},</h2>
          <p>
            You have been invited to a <strong>live video meeting</strong> for your course:
            <br />
            <span style="font-size:16px; font-weight:bold; color:#4F46E5;">${
              course.title
            }</span>
          </p>

          <p>
            📅 <strong>Date:</strong> ${convertodate} <br />
            🕒 <strong>Time:</strong> ${meeting.startTime.slice(0, 5)}
          </p>

          <p style="margin:20px 0;">
            Click the button below to join your video call meeting:
          </p>

          <!-- CTA Button -->
          <p style="text-align:center;">
            <a href="${process.env.MEETING_URL}/${meetingUrl}/${scheduleId}/${
        meeting._id
      }" target="_blank" style="background:#4F46E5; color:#fff; text-decoration:none; padding:12px 24px; border-radius:6px; font-weight:bold;">
              Join Meeting
            </a>
          </p>

          <p style="margin-top:20px; font-size:14px; color:#555;">
            If the button doesn’t work, copy and paste this link into your browser:
            <br />
            <a href="${process.env.MEETING_URL}/${meetingUrl}/${scheduleId}/${
        meeting._id
      }" target="_blank" style="color:#4F46E5;">${
        process.env.MEETING_URL
      }/${meetingUrl}/${scheduleId}/${meeting._id}</a>
          </p>
        </td>
      </tr>

      <!-- Footer -->
      <tr>
        <td style="background:#f9fafb; padding:20px; text-align:center; font-size:12px; color:#777;">
          © 2025 LMS Academy. All rights reserved. <br />
          This is an automated email, please do not reply.
        </td>
      </tr>
    </table>
  </body>
</html>
`;

      try {
        await sendEmail({
          email: user.email,
          subject: "LMS Academy - Video Meeting Invitation",
          message: temptLate,
        });
      } catch (error) {
        return res
          .status(STATUS_CODES.INTERNAL_SERVER_ERROR)
          .json(
            new apiError(error.message, STATUS_CODES.INTERNAL_SERVER_ERROR)
          );
      }

      const getScheduleFromRedis = await redis.keys(
        `${SCHEDULE}:${updateUrlToSchedule.userId.toString()}`
      );
      const getSingleScheduleFromRedis = await redis.get(
        `${SCHEDULE}:${updateUrlToSchedule.userId.toString()}:${scheduleId}`
      );

      if (getScheduleFromRedis) {
        await redis.del(`${SCHEDULE}:${updateUrlToSchedule.userId.toString()}`);
      }

      if (getSingleScheduleFromRedis) {
        await redis.del(
          `${SCHEDULE}:${updateUrlToSchedule.userId.toString()}:${scheduleId}`
        );
      }

      const getScheduleForInstructor = await redis.keys(
        `${SCHEDULE}:${updateUrlToSchedule.instuctorId.toString()}`
      );
      const getSingleScheduleForInstructor = await redis.get(
        `${SCHEDULE}:${updateUrlToSchedule.instuctorId.toString()}:${scheduleId}`
      );

      if (getScheduleForInstructor) {
        await redis.del(
          `${SCHEDULE}:${updateUrlToSchedule.instuctorId.toString()}`
        );
      }

      if (getSingleScheduleForInstructor) {
        await redis.del(
          `${SCHEDULE}:${updateUrlToSchedule.instuctorId.toString()}:${scheduleId}`
        );
      }

      return res
        .status(STATUS_CODES.CREATED)
        .json(
          new apiResponse(
            STATUS_CODES.CREATED,
            { roomId: meeting.roomId },
            "Meeting created"
          )
        );
    } catch (error) {
      return res
        .status(STATUS_CODES.INTERNAL_SERVER_ERROR)
        .json(new apiError(error.message, STATUS_CODES.INTERNAL_SERVER_ERROR));
    }
  }

  async getSingleMeeting(req, res) {
    try {
      const { meetingId } = req.params;

      if (!mongooseValidObjectId(meetingId)) {
        return res
          .status(STATUS_CODES.BAD_REQUEST)
          .json(new apiError("Invalid meeting id", STATUS_CODES.BAD_REQUEST));
      }

      const meeting = await Meeting.findById(meetingId).select("-__v");

      if (!meeting) {
        return res
          .status(STATUS_CODES.INTERNAL_SERVER_ERROR)
          .json(
            new apiError(
              "Meeting not fetched some thing went wrong",
              STATUS_CODES.INTERNAL_SERVER_ERROR
            )
          );
      }

      return res
        .status(STATUS_CODES.OK)
        .json(new apiResponse(STATUS_CODES.OK, meeting, "Meeting found"));
    } catch (error) {
      return res
        .status(STATUS_CODES.INTERNAL_SERVER_ERROR)
        .json(new apiError(error.message, STATUS_CODES.INTERNAL_SERVER_ERROR));
    }
  }

  async updateMeeting(req, res) {
    try {
      const { scheduleId, meetingId } = req.params;

      if (!mongooseValidObjectId(meetingId)) {
        return res
          .status(STATUS_CODES.BAD_REQUEST)
          .json(new apiError("Invalid meeting id", STATUS_CODES.BAD_REQUEST));
      }

      if (!mongooseValidObjectId(scheduleId)) {
        return res
          .status(STATUS_CODES.BAD_REQUEST)
          .json(new apiError("Invalid schedule id", STATUS_CODES.BAD_REQUEST));
      }

      const [meeting, schedule] = await Promise.all([
        await Meeting.findByIdAndUpdate(meetingId, { completed: true }),
        await Schedule.findByIdAndUpdate(scheduleId, { status: "Completed" }),
      ]);

      if (!meeting || !schedule) {
        return res
          .status(STATUS_CODES.INTERNAL_SERVER_ERROR)
          .json(
            new apiError(
              "Something went wrong",
              STATUS_CODES.INTERNAL_SERVER_ERROR
            )
          );
      }

      const keys = await redis.keys(`${SCHEDULE}:*`);

      if (keys.length > 0) {
        await redis.del(keys);
      }

      return res
        .status(STATUS_CODES.OK)
        .json(new apiResponse(STATUS_CODES.OK, {}, "Meeting completed"));
    } catch (error) {
      return res
        .status(STATUS_CODES.INTERNAL_SERVER_ERROR)
        .json(new apiError(error.message, STATUS_CODES.INTERNAL_SERVER_ERROR));
    }
  }
}

module.exports = new MeetingController();
