const Joi = require("joi");

const createAnnouncementValidation = (data) => {
  const schema = Joi.object({
    courseId: Joi.string().required().messages({
      "string.base": "Course ID must be a string",
      "string.empty": "Please provide a course ID",
      "any.required": "Course ID is required",
    }),
    title: Joi.string().required().min(5).max(100).messages({
      "string.empty": "Title is required",
      "any.required": "Title is required",
      "string.min": "Title must be at least 5 characters long",
      "string.max": "Title must be at most 100 characters long",
    }),
    description: Joi.string().required().min(10).max(1000).messages({
      "string.empty": "Description is required",
      "any.required": "Description is required",
      "string.min": "Description must be at least 10 characters long",
      "string.max": "Description must be at most 1000 characters long",
    }),
  });

  return schema.validate(data, { abortEarly: false });
};

const updateAnnouncementValidation = (data) => {
  const schema = Joi.object({
    title: Joi.string().required().min(5).max(100).messages({
      "string.empty": "Title is required",
      "any.required": "Title is required",
      "string.min": "Title must be at least 5 characters long",
      "string.max": "Title must be at most 100 characters long",
    }),
    description: Joi.string().required().min(10).max(1000).messages({
      "string.empty": "Description is required",
      "any.required": "Description is required",
      "string.min": "Description must be at least 10 characters long",
      "string.max": "Description must be at most 1000 characters long",
    }),
  });

  return schema.validate(data, { abortEarly: false });
};

module.exports = { createAnnouncementValidation, updateAnnouncementValidation };
