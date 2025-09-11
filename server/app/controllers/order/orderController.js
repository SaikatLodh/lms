const Order = require("../../models/orderModel");
const Course = require("../../models/courseModel");
const AddToCart = require("../../models/addToCartModel");
const Notification = require("../../models/notificationModel");
const apiResponse = require("../../config/apiResponse");
const apiError = require("../../config/apiError");
const STATUS_CODES = require("../../config/httpStatusCodes");
const mongooseValidObjectId = require("mongoose").isValidObjectId;
const razorpay = require("../../helpers/razorpay");
const {
  createOrderValidation,
  getPaymentProcessValidation,
} = require("../../helpers/validation/order/ordervalidator");
const crypto = require("crypto");
const { userSocketIDs, getIO } = require("../../config/socketStore");
const { NOTIFICATION } = require("../../config/socketKeys");
const redis = require("../../config/redis");
const { COURSE, COURSE_SUGGESTION } = require("../../config/redisKey");
class AnnouncementController {
  async createOrder(req, res) {
    try {
      const { userId, instructorId, courseId, totalAmount } = req.body;

      const user = req.user._id;

      if (user.toString() === instructorId.toString()) {
        return res
          .status(STATUS_CODES.UNAUTHORIZED)
          .json(
            new apiError(
              "Instructor cunt buy own course",
              STATUS_CODES.UNAUTHORIZED
            )
          );
      }

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

      const { error } = createOrderValidation(req.body);

      if (error) {
        return res
          .status(STATUS_CODES.BAD_REQUEST)
          .json(
            new apiError(error.details[0].message, STATUS_CODES.BAD_REQUEST)
          );
      }

      const options = {
        amount: totalAmount * 100,
        currency: "INR",
      };

      const createRazorpayorder = await razorpay.orders.create(options);

      if (!createRazorpayorder) {
        return res.redirect(
          `${process.env.CLIENT_URL}/user/order/payment-failure`
        );
      }

      const order = await Order.create({
        userId,
        instructorId,
        courseId,
        totalAmount,
      });

      if (!order) {
        return res
          .status(STATUS_CODES.INTERNAL_SERVER_ERROR)
          .json(
            new apiError(
              "Error in creating order",
              STATUS_CODES.INTERNAL_SERVER_ERROR
            )
          );
      }
      createRazorpayorder.OrderId = order._id;
      return res
        .status(STATUS_CODES.CREATED)
        .json(
          new apiResponse(
            STATUS_CODES.CREATED,
            { razorpayOrderDetails: createRazorpayorder },
            "Order created"
          )
        );
    } catch (error) {
      return res
        .status(STATUS_CODES.INTERNAL_SERVER_ERROR)
        .json(new apiError(error.message, STATUS_CODES.INTERNAL_SERVER_ERROR));
    }
  }

  async getKeys(req, res) {
    try {
      return res
        .status(STATUS_CODES.OK)
        .json(
          new apiResponse(
            STATUS_CODES.OK,
            { key: process.env.RAZORPAY_KEY_ID },
            "Keys fetched"
          )
        );
    } catch (error) {
      return res
        .status(STATUS_CODES.INTERNAL_SERVER_ERROR)
        .json(new apiError(error.message, STATUS_CODES.INTERNAL_SERVER_ERROR));
    }
  }

  async getPaymentProcess(req, res) {
    try {
      const { razorpay_payment_id, razorpay_order_id, razorpay_signature } =
        req.body;

      const orderId = req.params.id;

      if (!mongooseValidObjectId(orderId)) {
        return res
          .status(STATUS_CODES.BAD_REQUEST)
          .json(new apiError("Invalid order id", STATUS_CODES.BAD_REQUEST));
      }

      const { error } = getPaymentProcessValidation(req.body);

      if (error) {
        return res
          .status(STATUS_CODES.BAD_REQUEST)
          .json(
            new apiError(error.details[0].message, STATUS_CODES.BAD_REQUEST)
          );
      }

      const body = razorpay_order_id + "|" + razorpay_payment_id;

      const expectedSignature = crypto
        .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
        .update(body.toString())
        .digest("hex");

      const order = await Order.findById(orderId).populate({
        path: "userId",
        select: "fullName profilePicture gooleavatar faceBookavatar",
      });

      if (!order) {
        return res
          .status(STATUS_CODES.NOT_FOUND)
          .json(new apiError("Order not found", STATUS_CODES.NOT_FOUND));
      }

      if (razorpay_signature !== expectedSignature) {
        order.orderStatus = "failed";
        await order.save({ validateBeforeSave: false });
        return res.redirect(
          `${process.env.CLIENT_URL}/user/order/payment-failure`
        );
      }

      order.orderStatus = "paid";
      order.razorpayPaymentId = razorpay_payment_id;
      order.razorpayOrderId = razorpay_order_id;
      order.razorpaySignature = razorpay_signature;
      await order.save({ validateBeforeSave: false });

      const course = await Course.findById(order.courseId);
      course.orders.push(order._id);
      course.students.push(order.userId);
      await course.save({ validateBeforeSave: false });

      const cart = await AddToCart.findOne({
        userId: order.userId,
        isDeleted: false,
      });

      if (cart) {
        cart.isDeleted = true;
        await cart.save({ validateBeforeSave: false });
      }

      const createNotification = await Notification.create({
        senderId: order.userId,
        receiverId: order.instructorId,
        title: "New order",
        message: `${order.userId.fullName} has placed an order for ${course.title}.`,
        messageType: "instructor",
      });

      const getNotification = await Notification.findById(
        createNotification._id
      ).populate({
        path: "senderId",
        select: "fullName profilePicture gooleavatar faceBookavatar",
      });

      const getInstructorID = order.instructorId.toString();

      const io = getIO();
      const socketId = userSocketIDs.get(getInstructorID);

      if (socketId && getNotification) {
        io.to(socketId).emit(NOTIFICATION, getNotification);
      }

      const courseKeys = await redis.keys(`${COURSE}:*`);
      const allCourseKeys = await redis.keys(`${COURSE}`);
      const suggetionKeys = await redis.keys(`${COURSE_SUGGESTION}:*`);

      if (courseKeys.length > 0) {
        await redis.del(courseKeys);
      }

      if (allCourseKeys.length > 0) {
        await redis.del(allCourseKeys);
      }
      if (suggetionKeys.length > 0) {
        await redis.del(suggetionKeys);
      }

      return res.redirect(
        `${process.env.CLIENT_URL}/user/order/payment-success`
      );
    } catch (error) {
      return res
        .status(STATUS_CODES.INTERNAL_SERVER_ERROR)
        .json(new apiError(error.message, STATUS_CODES.INTERNAL_SERVER_ERROR));
    }
  }

  async getPaymentProcessForCart(req, res) {
    try {
      const { razorpay_payment_id, razorpay_order_id, razorpay_signature } =
        req.body;

      const orderIds = req.query.orderid.split(",").map((id) => id.trim());

      const { error } = getPaymentProcessValidation(req.body);

      if (error) {
        return res
          .status(STATUS_CODES.BAD_REQUEST)
          .json(
            new apiError(error.details[0].message, STATUS_CODES.BAD_REQUEST)
          );
      }

      const body = razorpay_order_id + "|" + razorpay_payment_id;

      const expectedSignature = crypto
        .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
        .update(body.toString())
        .digest("hex");

      const orders = await Order.find({ _id: { $in: orderIds } });

      if (!orders) {
        return res
          .status(STATUS_CODES.NOT_FOUND)
          .json(new apiError("Order not found", STATUS_CODES.NOT_FOUND));
      }

      if (!orders || orders.length !== orderIds.length) {
        return res
          .status(404)
          .json(
            new apiError("One or more orders not found", STATUS_CODES.NOT_FOUND)
          );
      }

      if (razorpay_signature !== expectedSignature) {
        for (const element of orders) {
          element.orderStatus = "failed";
          await element.save({ validateBeforeSave: false });
        }
        return res.redirect(
          `${process.env.CLIENT_URL}/user/order/payment-failure`
        );
      }

      for (const element of orders) {
        element.orderStatus = "paid";
        element.razorpayPaymentId = razorpay_payment_id;
        element.razorpayOrderId = razorpay_order_id;
        element.razorpaySignature = razorpay_signature;
        await element.save({ validateBeforeSave: false });

        const course = await Course.findById(element.courseId);
        course.orders.push(element._id);
        course.students.push(element.userId);
        await course.save({ validateBeforeSave: false });

        const cart = await AddToCart.findOne({
          userId: element.userId,
          isDeleted: false,
        });
        cart.isDeleted = true;
        await cart.save({ validateBeforeSave: false });

        const createNotification = await Notification.create({
          senderId: element.userId,
          receiverId: element.instructorId,
          title: "New order",
          message: `${element.userId.fullName} has placed an order for ${course.title}.`,
          messageType: "instructor",
        });

        const getNotification = await Notification.findById(
          createNotification._id
        ).populate({
          path: "senderId",
          select: "fullName profilePicture gooleavatar faceBookavatar",
        });

        const getInstructorID = element.instructorId.toString();

        const io = getIO();
        const socketId = userSocketIDs.get(getInstructorID);

        if (socketId && getNotification) {
          io.to(socketId).emit(NOTIFICATION, getNotification);
        }
      }

      const courseKeys = await redis.keys(`${COURSE}:*`);
      const allCourseKeys = await redis.keys(`${COURSE}`);
      const suggetionKeys = await redis.keys(`${COURSE_SUGGESTION}:*`);

      if (courseKeys.length > 0) {
        await redis.del(courseKeys);
      }

      if (allCourseKeys.length > 0) {
        await redis.del(allCourseKeys);
      }
      if (suggetionKeys.length > 0) {
        await redis.del(suggetionKeys);
      }

      return res.redirect(
        `${process.env.CLIENT_URL}/user/order/payment-success`
      );
    } catch (error) {
      return res
        .status(STATUS_CODES.INTERNAL_SERVER_ERROR)
        .json(new apiError(error.message, STATUS_CODES.INTERNAL_SERVER_ERROR));
    }
  }
}

module.exports = new AnnouncementController();
