const Joi = require("joi");

const createLectureValidation = (data) => {
  const schema = Joi.object({
    fullName: Joi.string().required().trim().min(3).max(50).messages({
      "string.base": "Full name must be a text value",
      "string.empty": "Full name is required",
      "any.required": "Full name field cannot be empty",
      "string.min": "Full name must be at least 3 characters long",
      "string.max": "Full name must be at most 50 characters long",
    }),
    email: Joi.string()
      .email({ minDomainSegments: 2, tlds: { allow: ["com", "net", "in"] } })
      .required()
      .trim()
      .messages({
        "string.base": "Email must be a text value",
        "string.empty": "Email is required",
        "string.email": "Please enter a valid email address",
        "any.required": "Email field cannot be empty",
        "string.tlds":
          "Email must end with a valid domain (e.g., .com, .net, .in)",
      }),
    password: Joi.string().required().trim().min(6).max(30).messages({
      "string.base": "Password must be a text value",
      "string.empty": "Password is required",
      "any.required": "Password field cannot be empty",
      "string.min": "Password must be at least 6 characters long",
      "string.max": "Password must be at most 30 characters long",
    }),
  });

  return schema.validate(data, { abortEarly: false });
};

module.exports = { createLectureValidation };
