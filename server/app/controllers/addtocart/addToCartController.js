const AddToCart = require("../../models/addToCartModel");
const apiResponse = require("../../config/apiResponse");
const apiError = require("../../config/apiError");
const STATUS_CODES = require("../../config/httpStatusCodes");
const mongooseValidObjectId = require("mongoose").isValidObjectId;
const { ObjectId } = require("mongodb");
class AddToCartController {
  async addtoCartAndRemoveCart(req, res) {
    try {
      const { courseId } = req.params;
      const userId = req.user._id;
      if (!mongooseValidObjectId(userId) || !mongooseValidObjectId(courseId)) {
        return res
          .status(STATUS_CODES.BAD_REQUEST)
          .json(
            new apiError(
              "Invalid user ID or course ID",
              STATUS_CODES.BAD_REQUEST
            )
          );
      }

      const findCart = await AddToCart.findOne({
        userId: userId,
        courseId: courseId,
      });

      if (!findCart) {
        const addToCart = await AddToCart.create({
          userId: userId,
          courseId: courseId,
        });

        if (!addToCart) {
          return res
            .status(STATUS_CODES.INTERNAL_SERVER_ERROR)
            .json(
              new apiError(
                "Something went wrong",
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
              "Course added to cart successfully"
            )
          );
      } else {
        const findForToggle = await AddToCart.findOne({
          userId: userId,
          courseId: courseId,
          isDeleted: false,
        });

        if (findForToggle) {
          findForToggle.isDeleted = true;
          await findForToggle.save({ validateBeforeSave: false });
          return res
            .status(STATUS_CODES.OK)
            .json(
              new apiResponse(
                STATUS_CODES.OK,
                {},
                "Course removed from cart successfully"
              )
            );
        } else {
          findCart.isDeleted = false;
          await findCart.save({ validateBeforeSave: false });
          return res
            .status(STATUS_CODES.OK)
            .json(
              new apiResponse(
                STATUS_CODES.OK,
                {},
                "Course added to cart successfully"
              )
            );
        }
      }
    } catch (error) {
      return res
        .status(STATUS_CODES.INTERNAL_SERVER_ERROR)
        .json(new apiError(error.message, STATUS_CODES.INTERNAL_SERVER_ERROR));
    }
  }

  async getCart(req, res) {
    try {
      const userId = req.user._id;
      const mongoObjectId = new ObjectId(userId);
      if (!mongooseValidObjectId(userId)) {
        return res
          .status(STATUS_CODES.BAD_REQUEST)
          .json(new apiError("Invalid user ID", STATUS_CODES.BAD_REQUEST));
      }

      const findCart = await AddToCart.aggregate([
        {
          $match: {
            userId: mongoObjectId,
            isDeleted: false,
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
            userId: 1,
            isDeleted: 1,
            "courses._id": 1,
            "courses.instructorId": 1,
            "courses.instructorName": 1,
            "courses.title": 1,
            "courses.category": 1,
            "courses.level": 1,
            "courses.description": 1,
            "courses.primaryLanguage": 1,
            "courses.subtitle": 1,
            "courses.pricing": 1,
            "courses.image": 1,
          },
        },
      ]);

      if (!findCart) {
        return res
          .status(STATUS_CODES.NOT_FOUND)
          .json(new apiError("Cart not found", STATUS_CODES.NOT_FOUND));
      }

      return res
        .status(STATUS_CODES.OK)
        .json(
          new apiResponse(
            STATUS_CODES.OK,
            { cart: findCart },
            "Cart found successfully"
          )
        );
    } catch (error) {
      return res
        .status(STATUS_CODES.INTERNAL_SERVER_ERROR)
        .json(new apiError(error.message, STATUS_CODES.INTERNAL_SERVER_ERROR));
    }
  }
}

module.exports = new AddToCartController();
