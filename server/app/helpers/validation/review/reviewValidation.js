const Joi = require("joi");

const createReviewValidation = (data) => {
  const schema = Joi.object({
    courseId: Joi.string().required().messages({
      "string.empty": "Course ID is required",
      "any.required": "Course ID is required",
    }),
    rating: Joi.number().required().min(1).max(5).messages({
      "number.empty": "Rating is required",
      "any.required": "Rating is required",
      "number.min": "Rating must be at least 1",
      "number.max": "Rating must be at most 5",
    }),
    comment: Joi.string().required().messages({
      "string.empty": "Comment is required",
      "any.required": "Comment is required",
    }),
  });

  return schema.validate(data, { abortEarly: false });
};

const updateReviewValidation = (data) => {
  const schema = Joi.object({
    rating: Joi.number().required().min(1).max(5).messages({
      "number.empty": "Rating is required",
      "any.required": "Rating is required",
      "number.min": "Rating must be at least 1",
      "number.max": "Rating must be at most 5",
    }),
    comment: Joi.string().required().messages({
      "string.empty": "Comment is required",
      "any.required": "Comment is required",
    }),
  });
  return schema.validate(data, { abortEarly: false });
};

module.exports = { createReviewValidation, updateReviewValidation };
