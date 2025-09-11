const Announcement = require("../../models/announcementModel");
const Course = require("../../models/courseModel");
const apiResponse = require("../../config/apiResponse");
const apiError = require("../../config/apiError");
const STATUS_CODES = require("../../config/httpStatusCodes");
const {
  createAnnouncementValidation,
  updateAnnouncementValidation,
} = require("../../helpers/validation/announcement/anouncementvalidator");
const mongooseValidObjectId = require("mongoose").isValidObjectId;
const { ObjectId } = require("mongodb");

class AnnouncementController {
  async createAnnouncement(req, res) {
    try {
      const { courseId, title, description } = req.body;
      const lecturerId = req.user._id;

      if (!mongooseValidObjectId(courseId)) {
        return res
          .status(STATUS_CODES.BAD_REQUEST)
          .json(new apiError("Invalid course id", STATUS_CODES.BAD_REQUEST));
      }

      const { error } = createAnnouncementValidation(req.body);

      if (error) {
        return res
          .status(STATUS_CODES.BAD_REQUEST)
          .json(
            new apiError(error.details[0].message, STATUS_CODES.BAD_REQUEST)
          );
      }

      const course = await Course.findById(courseId);

      if (!course) {
        return res
          .status(STATUS_CODES.NOT_FOUND)
          .json(new apiError("Course not found"));
      }

      if (course.instructorId.toString() !== lecturerId.toString()) {
        return res
          .status(STATUS_CODES.UNAUTHORIZED)
          .json(
            new apiError(
              "You are not owner of this course",
              STATUS_CODES.UNAUTHORIZED
            )
          );
      }
      const announcement = await Announcement.create({
        courseId,
        lecturerId: lecturerId,
        title,
        description,
      });

      if (!announcement) {
        return res
          .status(STATUS_CODES.INTERNAL_SERVER_ERROR)
          .json(new apiError("Announcement not created"));
      }

      course.announcements.push(announcement._id);
      await course.save({ validateBeforeSave: false });
      return res
        .status(STATUS_CODES.CREATED)
        .json(
          new apiResponse(
            STATUS_CODES.CREATED,
            {},
            "Announcement created successfully"
          )
        );
    } catch (error) {
      return res
        .status(STATUS_CODES.INTERNAL_SERVER_ERROR)
        .json(new apiError(error.message, STATUS_CODES.INTERNAL_SERVER_ERROR));
    }
  }

  async getAnnouncementByCourse(req, res) {
    try {
      const courseId = req.params.id;
      const mongoObjectId = new ObjectId(courseId);
      if (!mongooseValidObjectId(courseId)) {
        return res
          .status(STATUS_CODES.BAD_REQUEST)
          .json(new apiError("Invalid course id", STATUS_CODES.BAD_REQUEST));
      }

      const getAnnouncement = await Announcement.aggregate([
        {
          $match: {
            courseId: mongoObjectId,
            isDeleted: false,
          },
        },
        {
          $lookup: {
            from: "users",
            localField: "lecturerId",
            foreignField: "_id",
            as: "lecturer",
          },
        },
        {
          $unwind: "$lecturer",
        },
        {
          $sort: {
            createdAt: -1,
          },
        },
        {
          $project: {
            courseId: 1,
            lecturerId: 1,
            title: 1,
            isDeleted: 1,
            description: 1,
            createdAt: 1,
            updatedAt: 1,
            "lecturer.fullName": 1,
            "lecturer.profilePicture": 1,
            "lecturer.gooleavatar": 1,
            "lecturer.faceBookavatar": 1,
          },
        },
      ]);

      if (!getAnnouncement) {
        return res
          .status(STATUS_CODES.NOT_FOUND)
          .json(new apiError("Course not found"));
      }

      return res
        .status(STATUS_CODES.OK)
        .json(
          new apiResponse(
            STATUS_CODES.OK,
            getAnnouncement,
            "Announcement found successfully"
          )
        );
    } catch (error) {
      return res
        .status(STATUS_CODES.INTERNAL_SERVER_ERROR)
        .json(new apiError(error.message, STATUS_CODES.INTERNAL_SERVER_ERROR));
    }
  }

  async getSingleAnnouncement(req, res) {
    try {
      const announcementId = req.params.id;
      if (!mongooseValidObjectId(announcementId)) {
        return res
          .status(STATUS_CODES.BAD_REQUEST)
          .json(
            new apiError("Invalid announcement id", STATUS_CODES.BAD_REQUEST)
          );
      }

      const announcement = await Announcement.findOne({
        _id: announcementId,
        isDeleted: false,
      })
        .select("-__v ")
        .populate({
          path: "lecturerId",
          select: "fullName profilePicture gooleavatar faceBookavatar",
        });

      if (!announcement) {
        return res
          .status(STATUS_CODES.NOT_FOUND)
          .json(new apiError("Announcement not found"));
      }

      return res
        .status(STATUS_CODES.OK)
        .json(
          new apiResponse(
            STATUS_CODES.OK,
            announcement,
            "Announcement found successfully"
          )
        );
    } catch (error) {
      return res
        .status(STATUS_CODES.INTERNAL_SERVER_ERROR)
        .json(new apiError(error.message, STATUS_CODES.INTERNAL_SERVER_ERROR));
    }
  }

  async updateAnnouncement(req, res) {
    try {
      const announcementId = req.params.id;
      const lecturerId = req.user._id;
      const { title, description } = req.body;
      if (!mongooseValidObjectId(announcementId)) {
        return res
          .status(STATUS_CODES.BAD_REQUEST)
          .json(
            new apiError("Invalid announcement id", STATUS_CODES.BAD_REQUEST)
          );
      }

      const { error } = updateAnnouncementValidation(req.body);

      if (error) {
        return res
          .status(STATUS_CODES.BAD_REQUEST)
          .json(
            new apiError(error.details[0].message, STATUS_CODES.BAD_REQUEST)
          );
      }

      const announcement = await Announcement.findOne({
        _id: announcementId,
        isDeleted: false,
      });

      if (!announcement) {
        return res
          .status(STATUS_CODES.NOT_FOUND)
          .json(new apiError("Announcement not found"));
      }

      if (announcement.lecturerId.toString() !== lecturerId.toString()) {
        return res
          .status(STATUS_CODES.UNAUTHORIZED)
          .json(
            new apiError(
              "You are not owner of this announcement",
              STATUS_CODES.UNAUTHORIZED
            )
          );
      }

      const updateAnnouncement = await Announcement.findOneAndUpdate(
        { _id: announcementId },
        {
          title: title || announcement.title,
          description: description || announcement.description,
        },
        { new: true }
      ).exec();

      if (!updateAnnouncement) {
        return res
          .status(STATUS_CODES.INTERNAL_SERVER_ERROR)
          .json(
            new apiError(
              "Announcement not updated",
              STATUS_CODES.INTERNAL_SERVER_ERROR
            )
          );
      }

      return res
        .status(STATUS_CODES.OK)
        .json(
          new apiResponse(
            STATUS_CODES.OK,
            {},
            "Announcement updated successfully"
          )
        );
    } catch (error) {
      return res
        .status(STATUS_CODES.INTERNAL_SERVER_ERROR)
        .json(new apiError(error.message, STATUS_CODES.INTERNAL_SERVER_ERROR));
    }
  }

  async deleteAnnouncement(req, res) {
    try {
      const announcementId = req.params.id;
      const lecturerId = req.user._id;
      if (!mongooseValidObjectId(announcementId)) {
        return res
          .status(STATUS_CODES.BAD_REQUEST)
          .json(
            new apiError("Invalid announcement id", STATUS_CODES.BAD_REQUEST)
          );
      }

      const announcement = await Announcement.findOne({
        _id: announcementId,
        isDeleted: false,
      });

      if (!announcement) {
        return res
          .status(STATUS_CODES.NOT_FOUND)
          .json(new apiError("Announcement not found"));
      }

      if (announcement.lecturerId.toString() !== lecturerId.toString()) {
        return res
          .status(STATUS_CODES.UNAUTHORIZED)
          .json(
            new apiError(
              "You are not owner of this announcement",
              STATUS_CODES.UNAUTHORIZED
            )
          );
      }

      const deleteAnnouncement = await Announcement.findOneAndUpdate(
        { _id: announcementId },
        { isDeleted: true },
        { new: true }
      ).exec();

      if (!deleteAnnouncement) {
        return res
          .status(STATUS_CODES.INTERNAL_SERVER_ERROR)
          .json(
            new apiError(
              "Announcement not deleted",
              STATUS_CODES.INTERNAL_SERVER_ERROR
            )
          );
      }

      return res
        .status(STATUS_CODES.OK)
        .json(
          new apiResponse(
            STATUS_CODES.OK,
            {},
            "Announcement deleted successfully"
          )
        );
    } catch (error) {
      return res
        .status(STATUS_CODES.INTERNAL_SERVER_ERROR)
        .json(new apiError(error.message, STATUS_CODES.INTERNAL_SERVER_ERROR));
    }
  }
}

module.exports = new AnnouncementController();
