const CourseProgress = require("../../models/courseprogressModel");
const Lecture = require("../../models/lectureModel");
const Course = require("../../models/courseModel");
const apiResponse = require("../../config/apiResponse");
const apiError = require("../../config/apiError");
const STATUS_CODES = require("../../config/httpStatusCodes");
const mongooseValidObjectId = require("mongoose").isValidObjectId;
const redis = require("../../config/redis");
const { PROGRESS } = require("../../config/redisKey");

class CourseProgressController {
  async getLectureProgress(req, res) {
    try {
      const { id } = req.params;
      const user = req.user._id;
      if (!mongooseValidObjectId(id)) {
        return res
          .status(STATUS_CODES.BAD_REQUEST)
          .json(new apiError("Invalid course ID", STATUS_CODES.BAD_REQUEST));
      }

      const isBuy = await Course.findOne({ _id: id, students: user });

      if (!isBuy) {
        return res
          .status(STATUS_CODES.UNAUTHORIZED)
          .json(
            new apiError(
              "You are not buy this course",
              STATUS_CODES.UNAUTHORIZED
            )
          );
      }

      const getProgress = await redis.get(`${PROGRESS}:${user}:${id}`);
      if (getProgress) {
        return res
          .status(STATUS_CODES.OK)
          .json(
            new apiResponse(
              STATUS_CODES.OK,
              JSON.parse(getProgress),
              "Lecture progress found successfully"
            )
          );
      }

      const getLectures = await Lecture.find({ courseId: id }).select("-__v");

      if (!getLectures) {
        return res
          .status(STATUS_CODES.NOT_FOUND)
          .json(
            new apiError("Course progress not found", STATUS_CODES.NOT_FOUND)
          );
      }

      await redis.set(
        `${PROGRESS}:${user}:${id}`,
        JSON.stringify(getLectures),
        "EX",
        900
      );

      return res
        .status(STATUS_CODES.OK)
        .json(
          new apiResponse(
            STATUS_CODES.OK,
            { lectures: getLectures },
            "Lecture progress found successfully"
          )
        );
    } catch (error) {
      return res
        .status(STATUS_CODES.INTERNAL_SERVER_ERROR)
        .json(new apiError(error.message, STATUS_CODES.INTERNAL_SERVER_ERROR));
    }
  }

  async getSingleLectureProgress(req, res) {
    try {
      const { id } = req.params;
      const user = req.user._id;

      if (!mongooseValidObjectId(id)) {
        return res
          .status(STATUS_CODES.BAD_REQUEST)
          .json(new apiError("Invalid lecture ID", STATUS_CODES.BAD_REQUEST));
      }

      const getProgress = await redis.get(`${PROGRESS}:${user}:${id}`);
      if (getProgress) {
        return res
          .status(STATUS_CODES.OK)
          .json(
            new apiResponse(
              STATUS_CODES.OK,
              JSON.parse(getProgress),
              "Lecture progress found successfully"
            )
          );
      }

      const getLecture = await Lecture.findOne({
        _id: id,
      })
        .populate("courseId")
        .select("-__v");

      if (!getLecture) {
        return res
          .status(STATUS_CODES.NOT_FOUND)
          .json(
            new apiError("Lecture progress not found", STATUS_CODES.NOT_FOUND)
          );
      }

      await redis.set(
        `${PROGRESS}:${user}:${id}`,
        JSON.stringify(getLecture),
        "EX",
        900
      );

      return res
        .status(STATUS_CODES.OK)
        .json(
          new apiResponse(
            STATUS_CODES.OK,
            { lecture: getLecture },
            "Lecture progress found successfully"
          )
        );
    } catch (error) {
      return res
        .status(STATUS_CODES.INTERNAL_SERVER_ERROR)
        .json(new apiError(error.message, STATUS_CODES.INTERNAL_SERVER_ERROR));
    }
  }

  async markCurrentLectureAsViewed(req, res) {
    try {
      const { courseId, lectureId } = req.params;
      const userId = req.user._id;
      if (!mongooseValidObjectId(userId)) {
        return res
          .status(STATUS_CODES.BAD_REQUEST)
          .json(new apiError("Invalid user ID", STATUS_CODES.BAD_REQUEST));
      }

      if (!mongooseValidObjectId(courseId)) {
        return res
          .status(STATUS_CODES.BAD_REQUEST)
          .json(new apiError("Invalid course ID", STATUS_CODES.BAD_REQUEST));
      }

      if (!mongooseValidObjectId(lectureId)) {
        return res
          .status(STATUS_CODES.BAD_REQUEST)
          .json(new apiError("Invalid lecture ID", STATUS_CODES.BAD_REQUEST));
      }

      const existingCourseProgress = await CourseProgress.findOne({
        urerId: userId,
        courseId,
      });

      const totalLecture = await Lecture.countDocuments({
        courseId,
      });

      if (existingCourseProgress?.progress?.length === totalLecture) {
        if (!existingCourseProgress.completed) {
          existingCourseProgress.completed = true;
          existingCourseProgress.completionDate = new Date();
          await existingCourseProgress.save({ validateBeforeSave: false });
        }
      }

      if (!existingCourseProgress) {
        const newCourseProgress = await CourseProgress.create({
          urerId: userId,
          courseId,
          progress: [lectureId],
          dateViewed: new Date(),
        });

        if (!newCourseProgress) {
          return res
            .status(STATUS_CODES.INTERNAL_SERVER_ERROR)
            .json(
              new apiError(
                "Course progress not created",
                STATUS_CODES.INTERNAL_SERVER_ERROR
              )
            );
        }
      } else {
        existingCourseProgress.progress =
          existingCourseProgress.progress.filter(
            (id) => id.toString() !== lectureId.toString()
          );
        existingCourseProgress?.progress?.push(lectureId);
        await existingCourseProgress.save({ validateBeforeSave: false });
      }

      if (existingCourseProgress.completed === true) {
        return res
          .status(STATUS_CODES.OK)
          .json(new apiResponse(STATUS_CODES.OK, {}, "Course completed"));
      }
      return res
        .status(STATUS_CODES.CREATED)
        .json(
          new apiResponse(STATUS_CODES.CREATED, {}, "Lecture marked as viewed")
        );
    } catch (error) {
      return res
        .status(STATUS_CODES.INTERNAL_SERVER_ERROR)
        .json(new apiError(error.message, STATUS_CODES.INTERNAL_SERVER_ERROR));
    }
  }

  async getCurrentCourseProgress(req, res) {
    try {
      const courseId = req.params.id;
      const userId = req.user._id;

      if (!mongooseValidObjectId(courseId)) {
        return res
          .status(STATUS_CODES.BAD_REQUEST)
          .json(new apiError("Invalid course ID", STATUS_CODES.BAD_REQUEST));
      }
      const currentProgress = await CourseProgress.findOne({
        urerId: userId,
        courseId,
      });

      if (!currentProgress) {
        return res
          .status(STATUS_CODES.NOT_FOUND)
          .json(
            new apiError(
              "Current course progress not found",
              STATUS_CODES.NOT_FOUND
            )
          );
      }

      const getCurrentLectureId = currentProgress.progress.reverse()[0];

      return res
        .status(STATUS_CODES.OK)
        .json(
          new apiResponse(
            STATUS_CODES.OK,
            { id: getCurrentLectureId },
            "Success"
          )
        );
    } catch (error) {
      return res
        .status(STATUS_CODES.INTERNAL_SERVER_ERROR)
        .json(new apiError(error.message, STATUS_CODES.INTERNAL_SERVER_ERROR));
    }
  }

  async resetCurrentCourseProgress(req, res) {
    try {
      const courseId = req.params.id;
      const userId = req.user._id;

      if (!mongooseValidObjectId(courseId)) {
        return res
          .status(STATUS_CODES.BAD_REQUEST)
          .json(new apiError("Invalid course ID", STATUS_CODES.BAD_REQUEST));
      }

      const keys = await redis.keys(`progress:*`);

      const resetCourse = await CourseProgress.findOne({
        urerId: userId,
        courseId,
      });

      if (!resetCourse) {
        return res
          .status(STATUS_CODES.NOT_FOUND)
          .json(
            new apiError("Course progress not found", STATUS_CODES.NOT_FOUND)
          );
      }
      resetCourse.progress = [];
      resetCourse.dateViewed = null;
      resetCourse.completionDate = null;
      resetCourse.completed = false;
      await resetCourse.save({ validateBeforeSave: false });

      if (keys.length > 0) {
        await redis.del(keys);
      }
      return res
        .status(STATUS_CODES.OK)
        .json(new apiResponse(STATUS_CODES.OK, {}, "Course progress reset"));
    } catch (error) {
      return res
        .status(STATUS_CODES.INTERNAL_SERVER_ERROR)
        .json(new apiError(error.message, STATUS_CODES.INTERNAL_SERVER_ERROR));
    }
  }
}

module.exports = new CourseProgressController();
