const Course = require("../../../models/courseModel");
const Notification = require("../../../models/notificationModel");
const apiResponse = require("../../../config/apiResponse");
const apiError = require("../../../config/apiError");
const STATUS_CODES = require("../../../config/httpStatusCodes");
const {
  createCourseValidation,
  updateCourseValidation,
  publishCourseValidation,
} = require("../../../helpers/validation/course/courseValidator");
const { uploadFile, deleteImage } = require("../../../helpers/cloudinary");
const mongooseValidObjectId = require("mongoose").isValidObjectId;
const { ObjectId } = require("mongodb");
const {
  COURSE,
  COURSE_BY_INSTRUCTOR,
  COURSE_SUGGESTION,
} = require("../../../config/redisKey");
const redis = require("../../../config/redis");
const { userSocketIDs, getIO } = require("../../../config/socketStore");
const { NOTIFICATION } = require("../../../config/socketKeys");

class CourseController {
  async createCourse(req, res) {
    try {
      const {
        title,
        category,
        level,
        primaryLanguage,
        subtitle,
        description,
        welcomeMessage,
        pricing,
      } = req.body;

      const instructorId = req.user._id;
      const instructorName = req.user.fullName;
      const image = req?.file?.path;

      if (!image) {
        return res
          .status(STATUS_CODES.BAD_REQUEST)
          .json(new apiError("Image is required", STATUS_CODES.BAD_REQUEST));
      }
      const { error } = createCourseValidation(req.body);

      if (error) {
        return res
          .status(STATUS_CODES.BAD_REQUEST)
          .json(
            new apiError(error.details[0].message, STATUS_CODES.BAD_REQUEST)
          );
      }

      const uploadImage = await uploadFile(image);

      if (!uploadImage) {
        return res
          .status(STATUS_CODES.INTERNAL_SERVER_ERROR)
          .json(
            new apiError(
              "Image upload failed",
              STATUS_CODES.INTERNAL_SERVER_ERROR
            )
          );
      }

      const createCourse = await Course.create({
        instructorId,
        instructorName,
        title,
        category,
        level,
        primaryLanguage,
        subtitle,
        description,
        image: {
          public_id: uploadImage.publicId,
          url: uploadImage.url,
        },
        welcomeMessage,
        pricing,
      });

      if (!createCourse) {
        return res
          .status(STATUS_CODES.INTERNAL_SERVER_ERROR)
          .json(
            new apiError(
              "Course creation failed",
              STATUS_CODES.INTERNAL_SERVER_ERROR
            )
          );
      }

      const getInstructorCourse = await redis.get(
        `${COURSE_BY_INSTRUCTOR}:${instructorId}`
      );

      if (getInstructorCourse) {
        await redis.del(`${COURSE_BY_INSTRUCTOR}:${instructorId}`);
      }

      return res
        .status(STATUS_CODES.CREATED)
        .json(
          new apiResponse(
            STATUS_CODES.CREATED,
            {},
            "Course created successfully"
          )
        );
    } catch (error) {
      return res
        .status(STATUS_CODES.INTERNAL_SERVER_ERROR)
        .json(new apiError(error.message, STATUS_CODES.INTERNAL_SERVER_ERROR));
    }
  }

  async getCourseByInstructor(req, res) {
    try {
      const instructorId = req.user._id;

      const getCourse = await redis.get(
        `${COURSE_BY_INSTRUCTOR}:${instructorId}`
      );
      if (getCourse) {
        return res
          .status(STATUS_CODES.OK)
          .json(
            new apiResponse(
              STATUS_CODES.OK,
              JSON.parse(getCourse),
              "Course found successfully"
            )
          );
      }

      const course = await Course.find({
        instructorId,
        isDeleted: false,
      })
        .select("-__v -orders -announcements -lectures -reviews -students")
        .sort({ createdAt: -1 });

      if (!course) {
        return res
          .status(STATUS_CODES.NOT_FOUND)
          .json(new apiError("Course not found", STATUS_CODES.NOT_FOUND));
      }

      await redis.set(
        `${COURSE_BY_INSTRUCTOR}:${instructorId}`,
        JSON.stringify(course)
      );
      return res
        .status(STATUS_CODES.OK)
        .json(
          new apiResponse(STATUS_CODES.OK, course, "Course found successfully")
        );
    } catch (error) {
      return res
        .status(STATUS_CODES.INTERNAL_SERVER_ERROR)
        .json(new apiError(error.message, STATUS_CODES.INTERNAL_SERVER_ERROR));
    }
  }

  async getSingleCourseByInstructor(req, res) {
    try {
      const courseId = req.params.id;
      const instructorId = req.user._id;
      if (!mongooseValidObjectId(courseId)) {
        return res
          .status(STATUS_CODES.BAD_REQUEST)
          .json(new apiError("Invalid course ID", STATUS_CODES.BAD_REQUEST));
      }

      const getSingleCourseFromRedis = await redis.get(
        `${COURSE_BY_INSTRUCTOR}:${instructorId}:${courseId}`
      );
      if (getSingleCourseFromRedis) {
        return res
          .status(STATUS_CODES.OK)
          .json(
            new apiResponse(
              STATUS_CODES.OK,
              JSON.parse(getSingleCourseFromRedis),
              "Course found successfully"
            )
          );
      }

      const course = await Course.findOne({
        _id: courseId,
        instructorId: instructorId,
      }).select("-__v -orders -announcements -lectures -reviews -students");

      if (!course) {
        return res
          .status(STATUS_CODES.NOT_FOUND)
          .json(new apiError("Course not found", STATUS_CODES.NOT_FOUND));
      }

      await redis.set(
        `${COURSE_BY_INSTRUCTOR}:${instructorId}:${courseId}`,
        JSON.stringify(course)
      );
      return res
        .status(STATUS_CODES.OK)
        .json(
          new apiResponse(STATUS_CODES.OK, course, "Course found successfully")
        );
    } catch (error) {
      return res
        .status(STATUS_CODES.INTERNAL_SERVER_ERROR)
        .json(new apiError(error.message, STATUS_CODES.INTERNAL_SERVER_ERROR));
    }
  }

  async getCourseByUser(req, res) {
    try {
      const getCourse = await redis.get(`${COURSE}`);

      if (getCourse) {
        return res
          .status(STATUS_CODES.OK)
          .json(
            new apiResponse(
              STATUS_CODES.OK,
              JSON.parse(getCourse),
              "Course found successfully"
            )
          );
      }

      const course = await Course.find({
        isPublised: true,
        isDeleted: false,
      })
        .populate("reviews")
        .select(
          "instructorName instructorId title category level primaryLanguage subtitle description image welcomeMessage pricing students reviews lectures createdAt updatedAt "
        )
        .sort({ createdAt: -1 });

      if (!course) {
        return res
          .status(STATUS_CODES.NOT_FOUND)
          .json(new apiError("Course not found", STATUS_CODES.NOT_FOUND));
      }

      await redis.set(`${COURSE}`, JSON.stringify(course), "EX", 900);
      return res
        .status(STATUS_CODES.OK)
        .json(
          new apiResponse(STATUS_CODES.OK, course, "Course found successfully")
        );
    } catch (error) {
      return res
        .status(STATUS_CODES.INTERNAL_SERVER_ERROR)
        .json(new apiError(error.message, STATUS_CODES.INTERNAL_SERVER_ERROR));
    }
  }

  async getSingleCourseByUser(req, res) {
    try {
      const courseId = req.params.id;

      if (!mongooseValidObjectId(courseId)) {
        return res
          .status(STATUS_CODES.BAD_REQUEST)
          .json(new apiError("Invalid course ID", STATUS_CODES.BAD_REQUEST));
      }

      const getCourse = await redis.get(`${COURSE}:${courseId}`);

      if (getCourse) {
        return res
          .status(STATUS_CODES.OK)
          .json(
            new apiResponse(
              STATUS_CODES.OK,
              JSON.parse(getCourse),
              "Course found successfully"
            )
          );
      }

      const mongoObjectId = new ObjectId(courseId);

      const course = await Course.aggregate([
        {
          $match: {
            _id: mongoObjectId,
          },
        },
        {
          $lookup: {
            from: "lectures",
            localField: "lectures",
            foreignField: "_id",
            as: "lectures",
          },
        },
        {
          $lookup: {
            from: "reviews",
            localField: "reviews",
            foreignField: "_id",
            as: "reviews",
            pipeline: [
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
            ],
          },
        },
        {
          $lookup: {
            from: "announcements",
            localField: "announcements",
            foreignField: "_id",
            as: "announcements",
            pipeline: [
              {
                $lookup: {
                  from: "users",
                  localField: "lecturerId",
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
                  "lecturer.password": 0,
                  "lecturer.forgotPasswordToken": 0,
                  "lecturer.forgotPasswordExpiry": 0,
                  "lecturer.fbId": 0,
                  "lecturer.__v": 0,
                },
              },
            ],
          },
        },
        {
          $sort: {
            createdAt: -1,
          },
        },
        {
          $project: {
            __v: 0,
            "lectures.__v": 0,
          },
        },
      ]);

      if (!course) {
        return res
          .status(STATUS_CODES.NOT_FOUND)
          .json(new apiError("Course not found", STATUS_CODES.NOT_FOUND));
      }

      await redis.set(
        `${COURSE}:${courseId}`,
        JSON.stringify(course),
        "EX",
        900
      );
      return res
        .status(STATUS_CODES.OK)
        .json(
          new apiResponse(STATUS_CODES.OK, course, "Course found successfully")
        );
    } catch (error) {
      return res
        .status(STATUS_CODES.INTERNAL_SERVER_ERROR)
        .json(new apiError(error.message, STATUS_CODES.INTERNAL_SERVER_ERROR));
    }
  }

  async updateCourse(req, res) {
    try {
      const {
        courseId,
        title,
        category,
        level,
        primaryLanguage,
        subtitle,
        description,
        welcomeMessage,
        pricing,
      } = req.body;

      const image = req?.file?.path;

      if (!mongooseValidObjectId(courseId)) {
        return res
          .status(STATUS_CODES.BAD_REQUEST)
          .json(new apiError("Invalid course ID", STATUS_CODES.BAD_REQUEST));
      }

      const { error } = updateCourseValidation(req.body);

      if (error) {
        return res
          .status(STATUS_CODES.BAD_REQUEST)
          .json(
            new apiError(error.details[0].message, STATUS_CODES.BAD_REQUEST)
          );
      }

      const getCourse = await Course.findById(courseId);

      if (!getCourse) {
        return res
          .status(STATUS_CODES.NOT_FOUND)
          .json(new apiError("Course not found", STATUS_CODES.NOT_FOUND));
      }

      const getSingleCourseFromRedis = await redis.get(`${COURSE}:${courseId}`);
      const getCourseFromRedis = await redis.get(`${COURSE}`);
      const getInstructorCourseFromRedis = await redis.get(
        `${COURSE_BY_INSTRUCTOR}:${getCourse.instructorId.toString()}`
      );
      const getInstructorSingleCourseFromRedis = await redis.get(
        `${COURSE_BY_INSTRUCTOR}:${getCourse.instructorId.toString()}:${courseId}`
      );
      const getSuggestedCourseFromRedis = await redis.get(
        `${COURSE_SUGGESTION}:${courseId}`
      );

      if (image) {
        await deleteImage(getCourse.image.public_id);

        const uploadImage = await uploadFile(image);

        if (!uploadImage) {
          return res
            .status(STATUS_CODES.INTERNAL_SERVER_ERROR)
            .json(
              new apiError(
                "Image upload failed",
                STATUS_CODES.INTERNAL_SERVER_ERROR
              )
            );
        }

        const updateCourse = await Course.findByIdAndUpdate(
          courseId,
          {
            title: title || getCourse.title,
            category: category || getCourse.category,
            level: level || getCourse.level,
            primaryLanguage: primaryLanguage || getCourse.primaryLanguage,
            subtitle: subtitle || getCourse.subtitle,
            description,
            image: {
              public_id: uploadImage.publicId || getCourse.image.public_id,
              url: uploadImage.url || getCourse.image.url,
            },
            welcomeMessage: welcomeMessage || getCourse.welcomeMessage,
            pricing: pricing || getCourse.pricing,
          },
          { new: true }
        );

        if (!updateCourse) {
          return res
            .status(STATUS_CODES.INTERNAL_SERVER_ERROR)
            .json(
              new apiError(
                "Course update failed",
                STATUS_CODES.INTERNAL_SERVER_ERROR
              )
            );
        }

        if (getSingleCourseFromRedis) {
          await redis.del(`${COURSE}:${courseId}`);
        }

        if (getCourseFromRedis) {
          await redis.del(`${COURSE}`);
        }

        if (getInstructorCourseFromRedis) {
          await redis.del(
            `${COURSE_BY_INSTRUCTOR}:${getCourse.instructorId.toString()}`
          );
        }

        if (getInstructorSingleCourseFromRedis) {
          await redis.del(
            `${COURSE_BY_INSTRUCTOR}:${getCourse.instructorId.toString()}:${courseId}`
          );
        }

        if (getSuggestedCourseFromRedis) {
          await redis.del(`${COURSE_SUGGESTION}:${courseId}`);
        }

        return res
          .status(STATUS_CODES.OK)
          .json(
            new apiResponse(STATUS_CODES.OK, {}, "Course updated successfully")
          );
      } else {
        const updateCourse = await Course.findByIdAndUpdate(
          courseId,
          {
            title: title || getCourse.title,
            category: category || getCourse.category,
            level: level || getCourse.level,
            primaryLanguage: primaryLanguage || getCourse.primaryLanguage,
            subtitle: subtitle || getCourse.subtitle,
            description,
            welcomeMessage: welcomeMessage || getCourse.welcomeMessage,
            pricing: pricing || getCourse.pricing,
          },
          { new: true }
        );

        if (!updateCourse) {
          return res
            .status(STATUS_CODES.INTERNAL_SERVER_ERROR)
            .json(
              new apiError(
                "Course update failed",
                STATUS_CODES.INTERNAL_SERVER_ERROR
              )
            );
        }

        if (getSingleCourseFromRedis) {
          await redis.del(`${COURSE}:${courseId}`);
        }

        if (getCourseFromRedis) {
          await redis.del(`${COURSE}`);
        }

        if (getInstructorCourseFromRedis) {
          await redis.del(
            `${COURSE_BY_INSTRUCTOR}:${getCourse.instructorId.toString()}`
          );
        }

        if (getInstructorSingleCourseFromRedis) {
          await redis.del(
            `${COURSE_BY_INSTRUCTOR}:${getCourse.instructorId.toString()}:${courseId}`
          );
        }

        if (getSuggestedCourseFromRedis) {
          await redis.del(`${COURSE_SUGGESTION}:${courseId}`);
        }

        return res
          .status(STATUS_CODES.OK)
          .json(
            new apiResponse(STATUS_CODES.OK, {}, "Course updated successfully")
          );
      }
    } catch (error) {
      return res
        .status(STATUS_CODES.INTERNAL_SERVER_ERROR)
        .json(new apiError(error.message, STATUS_CODES.INTERNAL_SERVER_ERROR));
    }
  }

  async deleteCourse(req, res) {
    try {
      const courseId = req.params.id;

      if (!mongooseValidObjectId(courseId)) {
        return res
          .status(STATUS_CODES.BAD_REQUEST)
          .json(new apiError("Invalid course ID", STATUS_CODES.BAD_REQUEST));
      }

      const deleteCourse = await Course.findByIdAndUpdate(
        courseId,
        {
          isDeleted: true,
        },
        { new: true }
      );

      if (!deleteCourse) {
        return res
          .status(STATUS_CODES.INTERNAL_SERVER_ERROR)
          .json(
            new apiError(
              "Course delete failed",
              STATUS_CODES.INTERNAL_SERVER_ERROR
            )
          );
      }

      const getSingleCourseFromRedis = await redis.get(`${COURSE}:${courseId}`);
      const getCourseFromRedis = await redis.get(`${COURSE}`);
      const getInstructorCourseFromRedis = await redis.get(
        `${COURSE_BY_INSTRUCTOR}:${deleteCourse.instructorId.toString()}`
      );
      const getInstructorSingleCourseFromRedis = await redis.get(
        `${COURSE_BY_INSTRUCTOR}:${deleteCourse.instructorId.toString()}:${courseId}`
      );
      const getSuggestedCourseFromRedis = await redis.get(
        `${COURSE_SUGGESTION}:${courseId}`
      );

      if (getSingleCourseFromRedis) {
        await redis.del(`${COURSE}:${courseId}`);
      }

      if (getCourseFromRedis) {
        await redis.del(`${COURSE}`);
      }

      if (getInstructorCourseFromRedis) {
        await redis.del(
          `${COURSE_BY_INSTRUCTOR}:${deleteCourse.instructorId.toString()}`
        );
      }

      if (getInstructorSingleCourseFromRedis) {
        await redis.del(
          `${COURSE_BY_INSTRUCTOR}:${deleteCourse.instructorId.toString()}:${courseId}`
        );
      }

      if (getSuggestedCourseFromRedis) {
        await redis.del(`${COURSE_SUGGESTION}:${courseId}`);
      }

      const getStudents = deleteCourse.students;

      getStudents.forEach(async (student) => {
        const createNotification = await Notification.create({
          senderId: deleteCourse.instructorId,
          receiverId: student,
          title: `Your course ${deleteCourse.title} is deleted`,
          message: `Your course ${deleteCourse.title} is deleted by instructor`,
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

      return res
        .status(STATUS_CODES.OK)
        .json(
          new apiResponse(STATUS_CODES.OK, {}, "Course deleted successfully")
        );
    } catch (error) {
      return res
        .status(STATUS_CODES.INTERNAL_SERVER_ERROR)
        .json(new apiError(error.message, STATUS_CODES.INTERNAL_SERVER_ERROR));
    }
  }

  async publishCourse(req, res) {
    try {
      const { isPublised, courseId } = req.body;
      const instructorId = req.user._id;
      if (!mongooseValidObjectId(courseId)) {
        return res
          .status(STATUS_CODES.BAD_REQUEST)
          .json(new apiError("Invalid course ID", STATUS_CODES.BAD_REQUEST));
      }

      const { error } = publishCourseValidation(req.body);

      if (error) {
        return res
          .status(STATUS_CODES.BAD_REQUEST)
          .json(
            new apiError(error.details[0].message, STATUS_CODES.BAD_REQUEST)
          );
      }
      const getSingleCourseFromRedis = await redis.get(`${COURSE}:${courseId}`);
      const getCourseFromRedis = await redis.get(`${COURSE}`);
      const getInstructorCourseFromRedis = await redis.get(
        `${COURSE_BY_INSTRUCTOR}:${instructorId}`
      );
      const getInstructorSingleCourseFromRedis = await redis.get(
        `${COURSE_BY_INSTRUCTOR}:${instructorId}:${courseId}`
      );
      const getSuggestedCourseFromRedis = await redis.get(
        `${COURSE_SUGGESTION}:${courseId}`
      );

      if (isPublised === true) {
        const publishCourse = await Course.findByIdAndUpdate(
          courseId,
          {
            isPublised: true,
            status: "published",
          },
          { new: true }
        );

        if (!publishCourse) {
          return res
            .status(STATUS_CODES.INTERNAL_SERVER_ERROR)
            .json(
              new apiError(
                "Course publish failed",
                STATUS_CODES.INTERNAL_SERVER_ERROR
              )
            );
        }
        if (getSingleCourseFromRedis) {
          await redis.del(`${COURSE}:${courseId}`);
        }

        if (getCourseFromRedis) {
          await redis.del(`${COURSE}`);
        }

        if (getInstructorCourseFromRedis) {
          await redis.del(
            `${COURSE_BY_INSTRUCTOR}:${publishCourse.instructorId.toString()}`
          );
        }

        if (getInstructorSingleCourseFromRedis) {
          await redis.del(
            `${COURSE_BY_INSTRUCTOR}:${publishCourse.instructorId.toString()}:${courseId}`
          );
        }

        if (getSuggestedCourseFromRedis) {
          await redis.del(`${COURSE_SUGGESTION}:${courseId}`);
        }

        const getStudents = publishCourse.students;

        getStudents.forEach(async (student) => {
          const createNotification = await Notification.create({
            senderId: publishCourse.instructorId,
            receiverId: student,
            title: `Your course ${publishCourse.title} is published`,
            message: "You can start learning now",
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
          senderId: publishCourse.instructorId,
          receiverId: "68af4eaf58fcd8bc21461714",
          title: `${publishCourse.title} is published`,
          message: `${publishCourse.title} is published by ${publishCourse.instructorName}`,
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

        return res
          .status(STATUS_CODES.OK)
          .json(new apiResponse(STATUS_CODES.OK, {}, "Course published"));
      } else {
        const publishCourse = await Course.findByIdAndUpdate(
          courseId,
          {
            isPublised: false,
            status: "draft",
          },
          { new: true }
        );

        if (!publishCourse) {
          return res
            .status(STATUS_CODES.INTERNAL_SERVER_ERROR)
            .json(
              new apiError(
                "Course publish failed",
                STATUS_CODES.INTERNAL_SERVER_ERROR
              )
            );
        }
        if (getSingleCourseFromRedis) {
          await redis.del(`${COURSE}:${courseId}`);
        }

        if (getCourseFromRedis) {
          await redis.del(`${COURSE}`);
        }

        if (getInstructorCourseFromRedis) {
          await redis.del(
            `${COURSE_BY_INSTRUCTOR}:${publishCourse.instructorId.toString()}`
          );
        }

        if (getInstructorSingleCourseFromRedis) {
          await redis.del(
            `${COURSE_BY_INSTRUCTOR}:${publishCourse.instructorId.toString()}:${courseId}`
          );
        }

        if (getSuggestedCourseFromRedis) {
          await redis.del(`${COURSE_SUGGESTION}:${courseId}`);
        }

        const getStudents = publishCourse.students;

        getStudents.forEach(async (student) => {
          const createNotification = await Notification.create({
            senderId: publishCourse.instructorId,
            receiverId: student,
            title: `Your course ${publishCourse.title} is unpublished`,
            message: "You cant start learning now",
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
          senderId: publishCourse.instructorId,
          receiverId: "68af4eaf58fcd8bc21461714",
          title: `${publishCourse.title} is unpublished`,
          message: `${publishCourse.title} is unpublished by ${publishCourse.instructorName}`,
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

        return res
          .status(STATUS_CODES.OK)
          .json(new apiResponse(STATUS_CODES.OK, {}, "Course unpublished"));
      }
    } catch (error) {
      return res
        .status(STATUS_CODES.INTERNAL_SERVER_ERROR)
        .json(new apiError(error.message, STATUS_CODES.INTERNAL_SERVER_ERROR));
    }
  }

  async suggestedCourses(req, res) {
    try {
      const { courseId } = req.params;

      if (!mongooseValidObjectId(courseId)) {
        return res
          .status(STATUS_CODES.BAD_REQUEST)
          .json(new apiError("Invalid course ID", STATUS_CODES.BAD_REQUEST));
      }

      const getCourseFromRedis = await redis.get(
        `${COURSE_SUGGESTION}:${courseId}`
      );

      if (getCourseFromRedis) {
        return res
          .status(STATUS_CODES.OK)
          .json(
            new apiResponse(
              STATUS_CODES.OK,
              JSON.parse(getCourseFromRedis),
              "Course found successfully"
            )
          );
      }

      const suggestedCourses = await Course.findOne({
        _id: { $ne: courseId },
        isPublised: true,
        isDeleted: false,
      });

      if (!suggestedCourses) {
        return res
          .status(STATUS_CODES.NOT_FOUND)
          .json(new apiError("Courses not found", STATUS_CODES.NOT_FOUND));
      }

      const findCourse = await Course.find({
        isDeleted: false,
        isPublised: true,
        $or: [
          { title: suggestedCourses.title },
          { category: suggestedCourses.category },
          { level: suggestedCourses.level },
          { primaryLanguage: suggestedCourses.primaryLanguage },
          { pricing: suggestedCourses.pricing },
          { instructorName: suggestedCourses.instructorName },
          { subtitle: suggestedCourses.subtitle },
          { description: suggestedCourses.description },
          { welcomeMessage: suggestedCourses.welcomeMessage },
        ],
      })
        .select(
          "instructorName instructorId title category level primaryLanguage subtitle description image welcomeMessage pricing students reviews lectures createdAt updatedAt"
        )
        .sort({ createdAt: -1 });

      if (!findCourse) {
        return res
          .status(STATUS_CODES.NOT_FOUND)
          .json(
            new apiError("Suggested courses not found", STATUS_CODES.NOT_FOUND)
          );
      }

      await redis.set(
        `${COURSE_SUGGESTION}:${courseId}`,
        JSON.stringify(findCourse)
      );

      return res
        .status(STATUS_CODES.OK)
        .json(new apiResponse(STATUS_CODES.OK, findCourse, "Courses found"));
    } catch (error) {
      return res
        .status(STATUS_CODES.INTERNAL_SERVER_ERROR)
        .json(new apiError(error.message, STATUS_CODES.INTERNAL_SERVER_ERROR));
    }
  }
}

module.exports = new CourseController();
