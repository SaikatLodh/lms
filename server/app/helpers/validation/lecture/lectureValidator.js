const joi = require("joi");

const createLectureWithBulkValidation = (data) => {
  const schema = joi.object({
    courseId: joi.string().required().messages({
      "string.empty": "Course ID is required",
      "any.required": "Course ID is required",
      "string.base": "Course ID must be a text value",
    }),
  });

  return schema.validate(data, { abortEarly: false });
};

const createLectureValidation = (data) => {
  const schema = joi.object({
    courseId: joi.string().required().messages({
      "string.empty": "Course ID is required",
      "any.required": "Course ID is required",
      "string.base": "Course ID must be a text value",
    }),
    title: joi.string().required().min(5).max(100).messages({
      "string.empty": "Title is required",
      "any.required": "Title is required",
      "string.min": "Title must be at least 5 characters long",
      "string.max": "Title must be at most 100 characters long",
      "string.base": "Title must be a text value",
    }),
    description: joi.string().required().min(10).max(500).messages({
      "string.empty": "Description is required",
      "any.required": "Description is required",
      "string.min": "Description must be at least 10 characters long",
      "string.max": "Description must be at most 500 characters long",
      "string.base": "Description must be a text value",
    }),
    freePreview: joi.string().optional().messages({
      "string.base": "Free preview must be a boolean value",
    }),
  });

  return schema.validate(data, { abortEarly: false });
};

const updateLectureValidation = (data) => {
  const schema = joi.object({
    courseId: joi.string().required().messages({
      "string.empty": "Course ID is required",
      "any.required": "Course ID is required",
      "string.base": "Course ID must be a text value",
    }),
    lectureId: joi.string().required().messages({
      "string.empty": "Lecture ID is required",
      "any.required": "Lecture ID is required",
      "string.base": "Lecture ID must be a text value",
    }),
    title: joi.string().required().min(5).max(100).messages({
      "string.empty": "Title is required",
      "any.required": "Title is required",
      "string.min": "Title must be at least 5 characters long",
      "string.max": "Title must be at most 100 characters long",
      "string.base": "Title must be a text value",
    }),
    description: joi.string().required().min(10).max(1000).messages({
      "string.empty": "Description is required",
      "any.required": "Description is required",
      "string.min": "Description must be at least 10 characters long",
      "string.max": "Description must be at most 1000 characters long",
      "string.base": "Description must be a text value",
    }),
    freePreview: joi.string().optional().messages({
      "string.base": "Free preview must be a boolean value",
    }),
  });

  return schema.validate(data, { abortEarly: false });
};

module.exports = {
  createLectureWithBulkValidation,
  createLectureValidation,
  updateLectureValidation,
};
