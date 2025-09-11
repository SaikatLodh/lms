const joi = require("joi");

const createMeetingValidation = (data) => {
  const schema = joi.object({
    courseId: joi.string().required().messages({
      "string.empty": "Course ID is required",
      "any.required": "Course ID is required",
    }),
    userId: joi.string().required().messages({
      "string.empty": "User ID is required",
      "any.required": "User ID is required",
    }),
    scheduleId: joi.string().required().messages({
      "string.empty": "Schedule ID is required",
      "any.required": "Schedule ID is required",
    }),
    meetingName: joi.string().required().messages({
      "string.empty": "Meeting name is required",
      "any.required": "Meeting name is required",
    }),
    duration: joi.number().required().min(1).max(120).messages({
      "number.empty": "Duration is required",
      "any.required": "Duration is required",
      "number.min": "Duration must be at least 1 minute",
      "number.max": "Duration must be at most 120 minutes (2 hours max)",
    }),
    date: joi.date().required().messages({
      "date.empty": "Date is required",
      "any.required": "Date is required",
    }),
    startTime: joi.string().required().messages({
      "string.empty": "Start time is required",
      "any.required": "Start time is required",
    }),
  });

  return schema.validate(data, { abortEarly: false });
};

module.exports = { createMeetingValidation };
