const joi = require("joi");

const createScheduleValidation = (data) => {
  const schema = joi.object({
    courseId: joi.string().required().messages({
      "string.empty": "Course ID is required",
      "any.required": "Course ID is required",
    }),
    instuctorId: joi.string().required().messages({
      "string.empty": "Instructor ID is required",
      "any.required": "Instructor ID is required",
    }),
    reason: joi.string().required().messages({
      "string.empty": "Reason is required",
      "any.required": "Reason is required",
    }),
    date: joi.date().required().messages({
      "date.empty": "Date is required",
      "any.required": "Date is required",
    }),
    time: joi.string().required().messages({
      "string.empty": "Time is required",
      "any.required": "Time is required",
    }),
  });

  return schema.validate(data, { abortEarly: false });
};

const updateScheduleValidation = (data) => {
  const schema = joi.object({
    reason: joi.string().optional().messages({
      "string.base": "Reason must be a text value",
    }),
    date: joi.date().optional().messages({
      "date.base": "Date must be a date value",
    }),
    time: joi.string().optional().messages({
      "string.base": "Time must be a text value",
    }),
    status: joi
      .string()
      .optional()
      .valid("Waiting", "Scheduled", "Completed", "Live", "Cancelled")
      .messages({
        "string.base": "Status must be a text value",
        "any.only":
          "Status must be one of: Waiting, Scheduled, Completed, Live, Cancelled",
      }),
  });

  return schema.validate(data, { abortEarly: false });
};

module.exports = { createScheduleValidation, updateScheduleValidation };
