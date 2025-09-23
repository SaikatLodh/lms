const Course = require("../../models/courseModel");
const Review = require("../../models/reviewModel");
const apiResponse = require("../../config/apiResponse");
const apiError = require("../../config/apiError");
const STATUS_CODES = require("../../config/httpStatusCodes");
const {
  createReviewValidation,
  updateReviewValidation,
} = require("../../helpers/validation/review/reviewValidation");
const mongooseValidObjectId = require("mongoose").isValidObjectId;
const redis = require("../../config/redis");
const { REVIEW, COURSE } = require("../../config/redisKey");

class ReviewController {
  async createReview(req, res) {
    try {
      const { courseId, comment, rating } = req.body;
      const userId = req.user._id;
      if (!mongooseValidObjectId(courseId)) {
        return res
          .status(STATUS_CODES.BAD_REQUEST)
          .json(new apiError("Invalid course id", STATUS_CODES.BAD_REQUEST));
      }

      const { error } = createReviewValidation(req.body);

      if (error) {
        return res
          .status(STATUS_CODES.BAD_REQUEST)
          .json(
            new apiError(error.details[0].message, STATUS_CODES.BAD_REQUEST)
          );
      }

      const checkReviewCreatedByuser = await Review.findOne({
        userId: userId,
        courseId: courseId,
        created: true,
      });

      if (checkReviewCreatedByuser) {
        return res
          .status(STATUS_CODES.BAD_REQUEST)
          .json(
            new apiError(
              "You have already reviewed this course",
              STATUS_CODES.BAD_REQUEST
            )
          );
      }

      const createCourse = await Review.create({
        userId: userId,
        courseId: courseId,
        rating: rating,
        comment: comment,
        created: true,
      });

      if (!createCourse) {
        return res
          .status(STATUS_CODES.INTERNAL_SERVER_ERROR)
          .json(
            new apiError(
              "Review creation failed",
              STATUS_CODES.INTERNAL_SERVER_ERROR
            )
          );
      }

      const addReviewToCourse = await Course.findOneAndUpdate(
        { _id: courseId },
        { $push: { reviews: createCourse._id } },
        { new: true }
      );

      if (!addReviewToCourse) {
        return res
          .status(STATUS_CODES.INTERNAL_SERVER_ERROR)
          .json(
            new apiError(
              "Review creation failed",
              STATUS_CODES.INTERNAL_SERVER_ERROR
            )
          );
      }

      const getCourse = await redis.get(`${COURSE}:${courseId}`);
      const getReview = await redis.get(`${REVIEW}:${courseId}`);

      if (getCourse) {
        await redis.del(`${COURSE}:${courseId}`);
      }

      if (getReview) {
        await redis.del(`${REVIEW}:${courseId}`);
      }

      return res
        .status(STATUS_CODES.CREATED)
        .json(new apiResponse(STATUS_CODES.CREATED, {}, "Review created"));
    } catch (error) {
      return res
        .status(STATUS_CODES.INTERNAL_SERVER_ERROR)
        .json(new apiError(error.message, STATUS_CODES.INTERNAL_SERVER_ERROR));
    }
  }

  async getReviewByCourse(req, res) {
    try {
      const courseId = req.params.id;
      if (!mongooseValidObjectId(courseId)) {
        return res
          .status(STATUS_CODES.BAD_REQUEST)
          .json(new apiError("Invalid course id", STATUS_CODES.BAD_REQUEST));
      }

      const getReview = await redis.get(`${REVIEW}:${courseId}`);

      if (getReview) {
        return res
          .status(STATUS_CODES.OK)
          .json(new apiResponse(STATUS_CODES.OK, JSON.parse(getReview)));
      }

      const findAllReview = await Review.aggregate([
        {
          $match: {
            courseId: courseId,
            isDeleted: false,
          },
        },
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
            _id: 1,
            user: {
              _id: 1,
              fullName: 1,
              email: 1,
              profilePicture: 1,
              gooleavatar: 1,
              faceBookavatar: 1,
            },
            rating: 1,
            comment: 1,
          },
        },
      ]);

      if (!findAllReview) {
        return res
          .status(STATUS_CODES.INTERNAL_SERVER_ERROR)
          .json(
            new apiError(
              "Review creation failed",
              STATUS_CODES.INTERNAL_SERVER_ERROR
            )
          );
      }

      await redis.set(
        `${REVIEW}:${courseId}`,
        JSON.stringify(findAllReview),
        "EX",
        900
      );

      return res
        .status(STATUS_CODES.OK)
        .json(
          new apiResponse(
            STATUS_CODES.OK,
            { reviews: findAllReview },
            "Course found"
          )
        );
    } catch (error) {
      return res
        .status(STATUS_CODES.INTERNAL_SERVER_ERROR)
        .json(new apiError(error.message, STATUS_CODES.INTERNAL_SERVER_ERROR));
    }
  }

  async getSingleReview(req, res) {
    try {
      const reviewId = req.params.id;
      if (!mongooseValidObjectId(reviewId)) {
        return res
          .status(STATUS_CODES.BAD_REQUEST)
          .json(new apiError("Invalid review id", STATUS_CODES.BAD_REQUEST));
      }

      const getReview = await redis.get(`${REVIEW}:${reviewId}`);
      if (getReview) {
        return res
          .status(STATUS_CODES.OK)
          .json(new apiResponse(STATUS_CODES.OK, JSON.parse(getReview)));
      }

      const findSingleReview = await Review.findOne({
        _id: reviewId,
        isDeleted: false,
      }).select("-__v");

      if (!findSingleReview) {
        return res
          .status(STATUS_CODES.NOT_FOUND)
          .json(new apiError("Review not found", STATUS_CODES.NOT_FOUND));
      }

      await redis.set(
        `${REVIEW}:${reviewId}`,
        JSON.stringify(findSingleReview)
      );

      return res
        .status(STATUS_CODES.OK)
        .json(
          new apiResponse(
            STATUS_CODES.OK,
            { review: findSingleReview },
            "Review found"
          )
        );
    } catch (error) {
      return res
        .status(STATUS_CODES.INTERNAL_SERVER_ERROR)
        .json(new apiError(error.message, STATUS_CODES.INTERNAL_SERVER_ERROR));
    }
  }

  async updateReview(req, res) {
    try {
      const reviewId = req.params.id;
      const userId = req.user._id;
      const { rating, comment } = req.body;
      if (!mongooseValidObjectId(reviewId)) {
        return res
          .status(STATUS_CODES.BAD_REQUEST)
          .json(new apiError("Invalid review id", STATUS_CODES.BAD_REQUEST));
      }

      const { error } = updateReviewValidation(req.body);

      if (error) {
        return res
          .status(STATUS_CODES.BAD_REQUEST)
          .json(
            new apiError(error.details[0].message, STATUS_CODES.BAD_REQUEST)
          );
      }

      const checkReviewCreatedByuser = await Review.findOne({
        _id: reviewId,
        userId: userId,
        created: true,
      });

      if (!checkReviewCreatedByuser) {
        return res
          .status(STATUS_CODES.UNAUTHORIZED)
          .json(
            new apiError(
              "You are not owner of this review",
              STATUS_CODES.UNAUTHORIZED
            )
          );
      }

      const updateReview = await Review.findOneAndUpdate(
        { _id: reviewId },
        {
          rating: rating || checkReviewCreatedByuser.rating,
          comment: comment || checkReviewCreatedByuser.comment,
        },
        { new: true }
      );

      if (!updateReview) {
        return res
          .status(STATUS_CODES.INTERNAL_SERVER_ERROR)
          .json(
            new apiError(
              "Review update failed",
              STATUS_CODES.INTERNAL_SERVER_ERROR
            )
          );
      }

      const getCourse = await redis.get(
        `${COURSE}:${updateReview.courseId.toString()}`
      );
      const getSingleReviewFromRedis = await redis.get(`${REVIEW}:${reviewId}`);

      if (getCourse) {
        await redis.del(`${COURSE}:${updateReview.courseId.toString()}`);
      }

      if (getSingleReviewFromRedis) {
        await redis.del(`${REVIEW}:${reviewId}`);
      }

      return res
        .status(STATUS_CODES.OK)
        .json(new apiResponse(STATUS_CODES.OK, {}, "Review updated"));
    } catch (error) {
      return res
        .status(STATUS_CODES.INTERNAL_SERVER_ERROR)
        .json(new apiError(error.message, STATUS_CODES.INTERNAL_SERVER_ERROR));
    }
  }

  async deleteReview(req, res) {
    try {
      const reviewId = req.params.id;
      const userId = req.user._id;
      if (!mongooseValidObjectId(reviewId)) {
        return res
          .status(STATUS_CODES.BAD_REQUEST)
          .json(new apiError("Invalid review id", STATUS_CODES.BAD_REQUEST));
      }

      const checkReviewCreatedByuser = await Review.findOne({
        _id: reviewId,
        userId: userId,
      });

      if (!checkReviewCreatedByuser) {
        return res
          .status(STATUS_CODES.UNAUTHORIZED)
          .json(
            new apiError(
              "You are not owner of this review",
              STATUS_CODES.UNAUTHORIZED
            )
          );
      }

      const deleteReview = await Review.findOneAndUpdate(
        { _id: reviewId },
        { isDeleted: true, created: false },
        { new: true }
      );

      if (!deleteReview) {
        return res
          .status(STATUS_CODES.INTERNAL_SERVER_ERROR)
          .json(
            new apiError(
              "Review delete failed",
              STATUS_CODES.INTERNAL_SERVER_ERROR
            )
          );
      }

      const removeReviewFormCourse = await Course.findOneAndUpdate(
        { _id: deleteReview.courseId },
        { $pull: { reviews: deleteReview._id } },
        { new: true }
      );

      if (!removeReviewFormCourse) {
        return res
          .status(STATUS_CODES.INTERNAL_SERVER_ERROR)
          .json(
            new apiError(
              "Review creation failed",
              STATUS_CODES.INTERNAL_SERVER_ERROR
            )
          );
      }

      const getCourse = await redis.get(
        `${COURSE}:${deleteReview.courseId.toString()}`
      );
      const getSingleReviewFromRedis = await redis.get(`${REVIEW}:${reviewId}`);

      if (getCourse) {
        await redis.del(`${COURSE}:${deleteReview.courseId.toString()}`);
      }

      if (getSingleReviewFromRedis) {
        await redis.del(`${REVIEW}:${reviewId}`);
      }

      return res
        .status(STATUS_CODES.OK)
        .json(new apiResponse(STATUS_CODES.OK, {}, "Review deleted"));
    } catch (error) {
      return res
        .status(STATUS_CODES.INTERNAL_SERVER_ERROR)
        .json(new apiError(error.message, STATUS_CODES.INTERNAL_SERVER_ERROR));
    }
  }
}

module.exports = new ReviewController();
