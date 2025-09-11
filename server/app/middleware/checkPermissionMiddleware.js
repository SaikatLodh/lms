const apiError = require("../config/apiError");
const STATUS_CODES = require("../config/httpStatusCodes");

const checkRoles = (userRole) => {
  return (req, res, next) => {
    const role = req.user.role;

    if (!req.user || !role) {
      return res
        .status(STATUS_CODES.FORBIDDEN)
        .json(new apiError(" Role not found", STATUS_CODES.FORBIDDEN));
    }

    if (userRole.includes(role)) {
      next();
    } else {
      return res
        .status(STATUS_CODES.FORBIDDEN)
        .json(new apiError("Access denied", STATUS_CODES.FORBIDDEN));
    }
  };
};

module.exports = checkRoles;
