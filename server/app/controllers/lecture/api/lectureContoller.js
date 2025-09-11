const Lecture = require("../../../models/lectureModel.js");
const Course = require("../../../models/courseModel.js");
const Notification = require("../../../models/notificationModel.js");
const apiResponse = require("../../../config/apiResponse");
const apiError = require("../../../config/apiError");
const STATUS_CODES = require("../../../config/httpStatusCodes");
const {
  createLectureWithBulkValidation,
  updateLectureValidation,
  createLectureValidation,
} = require("../../../helpers/validation/lecture/lectureValidator.js");
const { uploadVideos, deleteVideo } = require("../../../helpers/cloudinary.js");
const mongooseValidObjectId = require("mongoose").isValidObjectId;
const redis = require("../../../config/redis");
const { LECTURE } = require("../../../config/redisKey");
const { userSocketIDs, getIO } = require("../../../config/socketStore");
const { NOTIFICATION } = require("../../../config/socketKeys");

class LectureController {
  async createLectureWithBulk(req, res) {
    try {
      const { courseId } = req.body;
      const lecturerId = req.user._id;

      const files =
        req?.files && req?.files?.lectureVideos.length > 0
          ? req.files.lectureVideos
          : [];

      const { error } = createLectureWithBulkValidation(req.body);
      if (error) {
        return res
          .status(STATUS_CODES.BAD_REQUEST)
          .json(
            new apiError(error.details[0].message, STATUS_CODES.BAD_REQUEST)
          );
      }

      if (!mongooseValidObjectId(courseId)) {
        return res
          .status(STATUS_CODES.BAD_REQUEST)
          .json(new apiError("Invalid course id", STATUS_CODES.BAD_REQUEST));
      }

      if (!files.length > 0) {
        return res
          .status(STATUS_CODES.BAD_REQUEST)
          .json(new apiError("Lecture is required", STATUS_CODES.BAD_REQUEST));
      }

      for (let i = 0; i < files.length; i++) {
        const result = await uploadVideos(files[i].path);
        const lecture = await Lecture.create({
          courseId,
          lecturerId,
          title: `Lecture ${i}`,
          description: `Description for Lecture ${i}`,
          videos: result,
        });

        await Course.findOneAndUpdate(
          { _id: courseId },
          { $push: { lectures: lecture._id } }
        );
      }

      const getLecture = await redis.get(
        `${LECTURE}:${lecturerId}:${courseId}`
      );
      if (getLecture) {
        await redis.del(`${LECTURE}:${lecturerId}:${courseId}`);
      }

      return res
        .status(STATUS_CODES.CREATED)
        .json(
          new apiResponse(
            STATUS_CODES.CREATED,
            {},
            "Lecture created successfully"
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
      const { courseId, title, description, freePreview } = req.body;
      freePreview && JSON.parse(freePreview);
      const lecturerId = req.user._id;
      const file = req?.file?.path;

      if (!mongooseValidObjectId(courseId)) {
        return res
          .status(STATUS_CODES.BAD_REQUEST)
          .json(new apiError("Invalid course id", STATUS_CODES.BAD_REQUEST));
      }

      const { error } = createLectureValidation(req.body);

      if (error) {
        return res
          .status(STATUS_CODES.BAD_REQUEST)
          .json(
            new apiError(error.details[0].message, STATUS_CODES.BAD_REQUEST)
          );
      }

      const uploadVideo = await uploadVideos(file);
      if (!uploadVideo) {
        return res
          .status(STATUS_CODES.INTERNAL_SERVER_ERROR)
          .json(
            new apiError(
              "Lecture is required",
              STATUS_CODES.INTERNAL_SERVER_ERROR
            )
          );
      }
      const lecture = await Lecture.create({
        courseId,
        lecturerId,
        title,
        description,
        videos: uploadVideo,
        freePreview: freePreview || false,
      });

      if (!lecture) {
        return res
          .status(STATUS_CODES.INTERNAL_SERVER_ERROR)
          .json(
            new apiError(
              "Lecture is required",
              STATUS_CODES.INTERNAL_SERVER_ERROR
            )
          );
      }

      await Course.findOneAndUpdate(
        { _id: courseId },
        { $push: { lectures: lecture._id } }
      );

      const getLecture = await redis.get(
        `${LECTURE}:${lecturerId}:${courseId}`
      );
      if (getLecture) {
        await redis.del(`${LECTURE}:${lecturerId}:${courseId}`);
      }

      return res
        .status(STATUS_CODES.CREATED)
        .json(
          new apiResponse(
            STATUS_CODES.CREATED,
            {},
            "Lecture created successfully"
          )
        );
    } catch (error) {
      return res
        .status(STATUS_CODES.INTERNAL_SERVER_ERROR)
        .json(new apiError(error.message, STATUS_CODES.INTERNAL_SERVER_ERROR));
    }
  }

  async getLecturesByLecturer(req, res) {
    try {
      const courseId = req.params.courseId;
      const lecturerId = req.user._id;

      if (!mongooseValidObjectId(courseId)) {
        return res
          .status(STATUS_CODES.BAD_REQUEST)
          .json(new apiError("Invalid course id", STATUS_CODES.BAD_REQUEST));
      }

      const getLecture = await redis.get(
        `${LECTURE}:${lecturerId}:${courseId}`
      );
      if (getLecture) {
        return res
          .status(STATUS_CODES.OK)
          .json(
            new apiResponse(
              STATUS_CODES.OK,
              JSON.parse(getLecture),
              "Lectures found"
            )
          );
      }

      const lectures = await Lecture.find({
        courseId,
        lecturerId,
        isDeleted: false,
      }).sort({
        createdAt: -1,
      });

      if (!lectures) {
        return res
          .status(STATUS_CODES.NOT_FOUND)
          .json(new apiError("Lectures not found", STATUS_CODES.NOT_FOUND));
      }

      await redis.set(
        `${LECTURE}:${lecturerId}:${courseId}`,
        JSON.stringify(lectures)
      );

      return res
        .status(STATUS_CODES.OK)
        .json(new apiResponse(STATUS_CODES.OK, lectures, "Lectures found"));
    } catch (error) {
      return res
        .status(STATUS_CODES.INTERNAL_SERVER_ERROR)
        .json(new apiError(error.message, STATUS_CODES.INTERNAL_SERVER_ERROR));
    }
  }

  async getLectureById(req, res) {
    try {
      const lectureId = req.params.id;
      const lecturerId = req.user._id;
      if (!mongooseValidObjectId(lectureId)) {
        return res
          .status(STATUS_CODES.BAD_REQUEST)
          .json(new apiError("Invalid lecture id", STATUS_CODES.BAD_REQUEST));
      }

      const getLecture = await redis.get(
        `${LECTURE}:${lecturerId}:${lectureId}`
      );
      if (getLecture) {
        return res
          .status(STATUS_CODES.OK)
          .json(
            new apiResponse(
              STATUS_CODES.OK,
              JSON.parse(getLecture),
              "Lecture found"
            )
          );
      }

      const lecture = await Lecture.findById(lectureId);

      if (!lecture) {
        return res
          .status(STATUS_CODES.NOT_FOUND)
          .json(new apiError("Lecture not found", STATUS_CODES.NOT_FOUND));
      }

      await redis.set(
        `${LECTURE}:${lecturerId}:${lectureId}`,
        JSON.stringify(lecture)
      );

      return res
        .status(STATUS_CODES.OK)
        .json(new apiResponse(STATUS_CODES.OK, lecture, "Lecture found"));
    } catch (error) {
      return res
        .status(STATUS_CODES.INTERNAL_SERVER_ERROR)
        .json(new apiError(error.message, STATUS_CODES.INTERNAL_SERVER_ERROR));
    }
  }

  async updateLecture(req, res) {
    try {
      const { courseId, lectureId, title, description } = req.body;
      const lecturerId = req.user._id;
      const file = req?.file?.path;

      if (
        !mongooseValidObjectId(lectureId) ||
        !mongooseValidObjectId(courseId)
      ) {
        return res
          .status(STATUS_CODES.BAD_REQUEST)
          .json(new apiError("Invalid ids", STATUS_CODES.BAD_REQUEST));
      }

      const { error } = updateLectureValidation(req.body);

      if (error) {
        return res
          .status(STATUS_CODES.BAD_REQUEST)
          .json(
            new apiError(error.details[0].message, STATUS_CODES.BAD_REQUEST)
          );
      }

      const lecture = await Lecture.findOne({
        _id: lectureId,
        courseId,
      });

      if (!lecture) {
        return res
          .status(STATUS_CODES.NOT_FOUND)
          .json(new apiError("Lecture not found", STATUS_CODES.NOT_FOUND));
      }

      const getLecture = await redis.get(
        `${LECTURE}:${lecturerId}:${courseId}`
      );
      const getSingleLecture = await redis.get(
        `${LECTURE}:${lecturerId}:${lectureId}`
      );

      if (lecture.lecturerId.toString() !== lecturerId.toString()) {
        return res
          .status(STATUS_CODES.UNAUTHORIZED)
          .json(
            new apiError(
              "You are not owner of this lecture",
              STATUS_CODES.UNAUTHORIZED
            )
          );
      }

      if (file) {
        const deletevideo = await deleteVideo(lecture.videos.public_id);

        if (!deletevideo) {
          return res
            .status(STATUS_CODES.INTERNAL_SERVER_ERROR)
            .json(
              new apiError(
                "Video delete failed in cloudinary",
                STATUS_CODES.INTERNAL_SERVER_ERROR
              )
            );
        }

        const result = await uploadVideos(file);

        if (!result) {
          return res
            .status(STATUS_CODES.INTERNAL_SERVER_ERROR)
            .json(
              new apiError(
                "Video upload failed in cloudinary",
                STATUS_CODES.INTERNAL_SERVER_ERROR
              )
            );
        }

        const updateLecture = await Lecture.findOneAndUpdate(
          { _id: lectureId },
          {
            title,
            description,
            videos: result,
          },
          { new: true }
        );

        if (!updateLecture) {
          return res
            .status(STATUS_CODES.INTERNAL_SERVER_ERROR)
            .json(
              new apiError(
                "Lecture update failed",
                STATUS_CODES.INTERNAL_SERVER_ERROR
              )
            );
        }
        if (getLecture) {
          await redis.del(`${LECTURE}:${lecturerId}:${courseId}`);
        }
        if (getSingleLecture) {
          await redis.del(`${LECTURE}:${lecturerId}:${lectureId}`);
        }
        return res
          .status(STATUS_CODES.OK)
          .json(
            new apiResponse(STATUS_CODES.OK, {}, "Lecture updated successfully")
          );
      } else {
        const updateLecture = await Lecture.findOneAndUpdate(
          { _id: lectureId },
          {
            title,
            description,
          },
          { new: true }
        );

        if (!updateLecture) {
          return res
            .status(STATUS_CODES.INTERNAL_SERVER_ERROR)
            .json(
              new apiError(
                "Lecture update failed",
                STATUS_CODES.INTERNAL_SERVER_ERROR
              )
            );
        }

        if (getLecture) {
          await redis.del(`${LECTURE}:${lecturerId}:${courseId}`);
        }
        if (getSingleLecture) {
          await redis.del(`${LECTURE}:${lecturerId}:${lectureId}`);
        }

        return res
          .status(STATUS_CODES.OK)
          .json(
            new apiResponse(STATUS_CODES.OK, {}, "Lecture updated successfully")
          );
      }
    } catch (error) {
      return res
        .status(STATUS_CODES.INTERNAL_SERVER_ERROR)
        .json(new apiError(error.message, STATUS_CODES.INTERNAL_SERVER_ERROR));
    }
  }

  async deleteLecture(req, res) {
    try {
      const { courseId, lectureId } = req.params;
      const lecturerId = req.user._id;
      if (
        !mongooseValidObjectId(lectureId) ||
        !mongooseValidObjectId(courseId)
      ) {
        return res
          .status(STATUS_CODES.BAD_REQUEST)
          .json(new apiError("Invalid lecture id", STATUS_CODES.BAD_REQUEST));
      }

      const lecture = await Lecture.findOne({
        _id: lectureId,
        courseId,
      });

      if (!lecture) {
        return res
          .status(STATUS_CODES.NOT_FOUND)
          .json(new apiError("Lecture not found", STATUS_CODES.NOT_FOUND));
      }

      if (lecture.lecturerId.toString() !== lecturerId.toString()) {
        return res
          .status(STATUS_CODES.UNAUTHORIZED)
          .json(
            new apiError(
              "You are not owner of this lecture",
              STATUS_CODES.UNAUTHORIZED
            )
          );
      }

      const getLecture = await redis.get(
        `${LECTURE}:${lecturerId}:${courseId}`
      );
      const getSingleLecture = await redis.get(
        `${LECTURE}:${lecturerId}:${lectureId}`
      );

      const deleteFormCourse = await Course.findOneAndUpdate(
        { _id: courseId },
        {
          $pull: { lectures: lectureId },
        },
        {
          new: true,
        }
      );

      if (!deleteFormCourse) {
        return res
          .status(STATUS_CODES.INTERNAL_SERVER_ERROR)
          .json(
            new apiError(
              "Lecture delete failed from course",
              STATUS_CODES.INTERNAL_SERVER_ERROR
            )
          );
      }

      const deleteLecture = await Lecture.findOneAndUpdate(
        { _id: lectureId },
        {
          isDeleted: true,
        },
        { new: true }
      );

      if (!deleteLecture) {
        return res
          .status(STATUS_CODES.INTERNAL_SERVER_ERROR)
          .json(
            new apiError(
              "Lecture delete failed",
              STATUS_CODES.INTERNAL_SERVER_ERROR
            )
          );
      }

      if (getLecture) {
        await redis.del(`${LECTURE}:${lecturerId}:${courseId}`);
      }
      if (getSingleLecture) {
        await redis.del(`${LECTURE}:${lecturerId}:${lectureId}`);
      }

      return res
        .status(STATUS_CODES.OK)
        .json(
          new apiResponse(STATUS_CODES.OK, {}, "Lecture deleted successfully")
        );
    } catch (error) {
      return res
        .status(STATUS_CODES.INTERNAL_SERVER_ERROR)
        .json(new apiError(error.message, STATUS_CODES.INTERNAL_SERVER_ERROR));
    }
  }

  async toggleFreePreview(req, res) {
    try {
      const { lectureId } = req.params;
      const lecturerId = req.user._id;

      if (!mongooseValidObjectId(lectureId)) {
        return res
          .status(STATUS_CODES.BAD_REQUEST)
          .json(new apiError("Invalid lecture id", STATUS_CODES.BAD_REQUEST));
      }
      const lecture = await Lecture.findOne({ _id: lectureId });

      if (!lecture) {
        return res
          .status(STATUS_CODES.NOT_FOUND)
          .json(new apiError("Lecture not found", STATUS_CODES.NOT_FOUND));
      }

      if (lecture.lecturerId.toString() !== lecturerId.toString()) {
        return res
          .status(STATUS_CODES.UNAUTHORIZED)
          .json(
            new apiError(
              "You are not owner of this lecture",
              STATUS_CODES.UNAUTHORIZED
            )
          );
      }

      const updateLecture = await Lecture.findOneAndUpdate(
        { _id: lectureId },
        {
          freePreview: !lecture.freePreview,
        },
        { new: true }
      );

      if (!updateLecture) {
        return res
          .status(STATUS_CODES.INTERNAL_SERVER_ERROR)
          .json(
            new apiError(
              "Lecture update failed",
              STATUS_CODES.INTERNAL_SERVER_ERROR
            )
          );
      }

      const getLecture = await redis.get(
        `${LECTURE}:${lecturerId}:${updateLecture.courseId.toString()}`
      );
      const getSingleLecture = await redis.get(
        `${LECTURE}:${lecturerId}:${lectureId}`
      );

      if (getLecture) {
        await redis.del(
          `${LECTURE}:${lecturerId}:${updateLecture.courseId.toString()}`
        );
      }

      if (getSingleLecture) {
        await redis.del(`${LECTURE}:${lecturerId}:${lectureId}`);
      }

      if (updateLecture.freePreview === true) {
        const course = await Course.findById(updateLecture.courseId);
        const getStudents = course.students;

        getStudents.forEach(async (student) => {
          const createNotification = await Notification.create({
            senderId: course.instructorId,
            receiverId: student,
            title: `Lecture added to course`,
            message: `Lecture ${updateLecture.title} has been added to course ${course.title}`,
            messageType: "user",
          });

          const getNotification = await Notification.findById(
            createNotification._id
          ).populate({
            path: "senderId",
            select: "fullName profilePicture gooleavatar faceBookavatar",
          });

          const getSocketId = userSocketIDs.get(student.toString());
          const io = getIO();

          if (getSocketId && getNotification) {
            io.to(getSocketId).emit(NOTIFICATION, getNotification);
          }
        });

        const createNotification = await Notification.create({
          senderId: course.instructorId,
          receiverId: "68af4eaf58fcd8bc21461714",
          title: `Lecture added to course`,
          message: `Lecture ${updateLecture.title} has been added to course ${course.title}`,
          messageType: "admin",
        });

        const getNotification = await Notification.findById(
          createNotification._id
        ).populate({
          path: "senderId",
          select: "fullName profilePicture gooleavatar faceBookavatar",
        });

        const getSocketId = userSocketIDs.get("68af4eaf58fcd8bc21461714");

        const io = getIO();

        if (getSocketId && getNotification) {
          io.to(getSocketId).emit(NOTIFICATION, getNotification);
        }
      }

      return res
        .status(STATUS_CODES.OK)
        .json(
          new apiResponse(STATUS_CODES.OK, {}, "Lecture updated successfully")
        );
    } catch (error) {
      return res
        .status(STATUS_CODES.INTERNAL_SERVER_ERROR)
        .json(new apiError(error.message, STATUS_CODES.INTERNAL_SERVER_ERROR));
    }
  }
}

module.exports = new LectureController();
