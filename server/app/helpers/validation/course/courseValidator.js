const joi = require("joi");

const createCourseValidation = (data) => {
  const schema = joi.object({
    title: joi.string().required().min(5).max(100).messages({
      "string.empty": "Title is required",
      "any.required": "Title is required",
      "string.min": "Title must be at least 5 characters long",
      "string.max": "Title must be at most 100 characters long",
    }),
    category: joi.string().required().messages({
      "string.empty": "Category is required",
      "any.required": "Category is required",
    }),
    level: joi
      .string()
      .lowercase()
      .valid("beginner", "intermediate", "advanced")
      .lowercase()
      .required()
      .messages({
        "string.empty": "Level is required",
        "any.required": "Level is required",
        "any.only":
          "Level must be one of 'beginner', 'intermediate', or 'advanced'",
      }),
    primaryLanguage: joi.string().required().messages({
      "string.empty": "Primary language is required",
      "any.required": "Primary language is required",
    }),
    subtitle: joi.string().required().min(5).max(100).messages({
      "string.empty": "Subtitle is required",
      "any.required": "Subtitle is required",
      "string.min": "Subtitle must be at least 5 characters long",
      "string.max": "Subtitle must be at most 100 characters long",
    }),
    description: joi.string().required().min(10).max(500).messages({
      "string.empty": "Description is required",
      "any.required": "Description is required",
      "string.min": "Description must be at least 10 characters long",
      "string.max": "Description must be at most 500 characters long",
    }),
    welcomeMessage: joi.string().required().min(10).max(500).messages({
      "string.empty": "Welcome message is required",
      "any.required": "Welcome message is required",
      "string.min": "Welcome message must be at least 10 characters long",
      "string.max": "Welcome message must be at most 500 characters long",
    }),
    pricing: joi.number().required().messages({
      "number.base": "Price must be a number",
      "any.required": "Price is required",
    }),
  });

  return schema.validate(data, { abortEarly: false });
};

const updateCourseValidation = (data) => {
  const schema = joi.object({
    courseId: joi.string().required().messages({
      "string.empty": "Course ID is required",
      "any.required": "Course ID is required",
    }),
    title: joi.string().required().min(5).max(100).messages({
      "string.empty": "Title is required",
      "any.required": "Title is required",
      "string.min": "Title must be at least 5 characters long",
      "string.max": "Title must be at most 100 characters long",
    }),
    category: joi.string().required().messages({
      "string.empty": "Category is required",
      "any.required": "Category is required",
    }),
    level: joi
      .string()
      .valid("beginner", "intermediate", "advanced")
      .required()
      .messages({
        "string.empty": "Level is required",
        "any.required": "Level is required",
        "any.only":
          "Level must be one of 'beginner', 'intermediate', or 'advanced'",
      }),
    primaryLanguage: joi.string().required().messages({
      "string.empty": "Primary language is required",
      "any.required": "Primary language is required",
    }),
    subtitle: joi.string().required().min(5).max(100).messages({
      "string.empty": "Subtitle is required",
      "any.required": "Subtitle is required",
      "string.min": "Subtitle must be at least 5 characters long",
      "string.max": "Subtitle must be at most 100 characters long",
    }),
    description: joi.string().required().min(10).max(500).messages({
      "string.empty": "Description is required",
      "any.required": "Description is required",
      "string.min": "Description must be at least 10 characters long",
      "string.max": "Description must be at most 500 characters long",
    }),
    welcomeMessage: joi.string().required().min(10).max(500).messages({
      "string.empty": "Welcome message is required",
      "any.required": "Welcome message is required",
      "string.min": "Welcome message must be at least 10 characters long",
      "string.max": "Welcome message must be at most 500 characters long",
    }),
    pricing: joi.number().required().messages({
      "number.base": "Price must be a number",
      "any.required": "Price is required",
    }),
  });

  return schema.validate(data, { abortEarly: false });
};

const publishCourseValidation = (data) => {
  const schema = joi.object({
    isPublised: joi.boolean().required().messages({
      "boolean.base": "Is published must be a boolean",
      "any.required": "Is published is required",
    }),
    courseId: joi.string().required().messages({
      "string.empty": "Course ID is required",
      "any.required": "Course ID is required",
    }),
  });

  return schema.validate(data, { abortEarly: false });
};

module.exports = {
  createCourseValidation,
  updateCourseValidation,
  publishCourseValidation,
};
