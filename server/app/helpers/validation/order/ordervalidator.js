const Joi = require("joi");

const createOrderValidation = (data) => {
  const schema = Joi.object({
    courseId: Joi.string().required().messages({
      "string.empty": "Course ID is required",
      "any.required": "Course ID is required",
    }),
    userId: Joi.string().required().messages({
      "string.empty": "User ID is required",
      "any.required": "User ID is required",
    }),
    instructorId: Joi.string().required().messages({
      "string.empty": "Instructor ID is required",
      "any.required": "Instructor ID is required",
    }),
    totalAmount: Joi.number().required().messages({
      "number.empty": "Total amount is required",
      "any.required": "Total amount is required",
    }),
  });

  return schema.validate(data, { abortEarly: false });
};

const getPaymentProcessValidation = (data) => {
  const schema = Joi.object({
    razorpay_payment_id: Joi.string().required().messages({
      "string.empty": "Razorpay payment ID is required",
      "any.required": "Razorpay payment ID is required",
    }),
    razorpay_order_id: Joi.string().required().messages({
      "string.empty": "Razorpay order ID is required",
      "any.required": "Razorpay order ID is required",
    }),
    razorpay_signature: Joi.string().required().messages({
      "string.empty": "Razorpay signature is required",
      "any.required": "Razorpay signature is required",
    }),
  });

  return schema.validate(data, { abortEarly: false });
};

module.exports = {
  createOrderValidation,
  getPaymentProcessValidation,
};
