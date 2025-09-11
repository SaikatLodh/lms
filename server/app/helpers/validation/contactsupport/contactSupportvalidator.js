const Joi = require("joi");

const createContactSupport = (data) => {
  const schema = Joi.object({
    fullName: Joi.string().required().messages({
      "string.empty": "Name is required",
      "any.required": "Name is required",
    }),
    email: Joi.string()
      .email({ minDomainSegments: 2, tlds: { allow: ["com", "net", "in"] } })
      .email()
      .required()
      .messages({
        "string.empty": "Email is required",
        "any.required": "Email is required",
        "string.email": "Please enter a valid email address",
        "string.tlds":
          "Email must end with a valid domain (e.g., .com, .net, .in)",
      }),
    number: Joi.number().required().messages({
      "number.empty": "Number is required",
      "any.required": "Number is required",
    }),
    subject: Joi.string().required().messages({
      "string.empty": "Subject is required",
      "any.required": "Subject is required",
    }),
    message: Joi.string().required().messages({
      "string.empty": "Message is required",
      "any.required": "Message is required",
    }),
  });

  return schema.validate(data, { abortEarly: false });
};

module.exports = { createContactSupport };
