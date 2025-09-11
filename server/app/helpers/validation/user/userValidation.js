const joi = require("joi");

const updateUserValidation = (data) => {
  const schema = joi.object({
    fullName: joi.string().trim().min(3).max(50).messages({
      "string.base": "Full name must be a text value",
      "string.min": "Full name must be at least 3 characters long",
      "string.max": "Full name must be at most 50 characters long",
      "string.empty": "Full name cannot be empty",
    }),
  });

  return schema.validate(data, { abortEarly: false });
};

module.exports = {
  updateUserValidation,
};
