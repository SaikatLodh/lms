const Notification = require("../../models/notificationModel");
const apiResponse = require("../../config/apiResponse");
const apiError = require("../../config/apiError");
const STATUS_CODES = require("../../config/httpStatusCodes");

class NotificationController {
  async getNotifications(req, res) {
    try {
      const user = req.user;

      if (user.role === "user") {
        const notifications = await Notification.find({
          receiverId: user._id,
          messageType: "user",
        })
          .populate({
            path: "senderId",
            select: "fullName profilePicture gooleavatar faceBookavatar",
          })
          .select("-__v")
          .sort({ createdAt: -1 });

        if (!notifications) {
          return res
            .status(STATUS_CODES.NOT_FOUND)
            .json(
              new apiError("Notifications not found", STATUS_CODES.NOT_FOUND)
            );
        }
        return res
          .status(STATUS_CODES.OK)
          .json(
            new apiResponse(
              STATUS_CODES.OK,
              notifications,
              "Notifications found successfully"
            )
          );
      } else {
        const notifications = await Notification.find({
          receiverId: user._id,
          messageType: "instructor",
        })
          .populate({
            path: "senderId",
            select: "fullName profilePicture gooleavatar faceBookavatar",
          })
          .sort({ createdAt: -1 });

        if (!notifications) {
          return res
            .status(STATUS_CODES.NOT_FOUND)
            .json(
              new apiError("Notifications not found", STATUS_CODES.NOT_FOUND)
            );
        }
        return res
          .status(STATUS_CODES.OK)
          .json(
            new apiResponse(
              STATUS_CODES.OK,
              notifications,
              "Notifications found successfully"
            )
          );
      }
    } catch (err) {
      return res
        .status(STATUS_CODES.INTERNAL_SERVER_ERROR)
        .json(new apiError(err.message, STATUS_CODES.INTERNAL_SERVER_ERROR));
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
        return res
          .status(STATUS_CODES.INTERNAL_SERVER_ERROR)
          .json(
            new apiError(
              "Some error occurred when updating",
              STATUS_CODES.INTERNAL_SERVER_ERROR
            )
          );
      }

      return res
        .status(STATUS_CODES.OK)
        .json(
          new apiResponse(STATUS_CODES.OK, {}, "Notification seen successfully")
        );
    } catch (err) {
      return res
        .status(STATUS_CODES.INTERNAL_SERVER_ERROR)
        .json(new apiError(err.message, STATUS_CODES.INTERNAL_SERVER_ERROR));
    }
  }
}

module.exports = new NotificationController();
