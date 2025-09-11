const apiError = require("../config/apiError");
const STATUS_CODES = require("../config/httpStatusCodes");

const adminCheckRoles = (userRole) => {
  return (req, res, next) => {
    const role = req.user.role;

    if (!req.user || !role) {
      req.flash("error", "Access denied");
      return res.redirect("/login");
    }

    if (userRole.includes(role)) {
      next();
    } else {
      return res.redirect("/login");
    }
  };
};

module.exports = adminCheckRoles;
