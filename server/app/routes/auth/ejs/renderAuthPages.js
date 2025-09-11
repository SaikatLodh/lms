const renderAuthPages = require("../../../controllers/auth/ejs/renderAuthPages");
const adminVerifyJwt = require("../../../middleware/adminMiddleware");
const adminCheckRoles = require("../../../middleware/AdminPermissionMiddleware");
const express = require("express");

const router = express.Router();

router.route("/login").get(renderAuthPages.renderLogin);
router.route("/sendemail").get(renderAuthPages.renderSedEmail);
router
  .route("/forgotpassword/:token")
  .get(renderAuthPages.renderForegotPassword);

router.route("/admin/login").post(renderAuthPages.login);
router
  .route("/admin/logout")
  .get(adminVerifyJwt, adminCheckRoles(["admin"]), renderAuthPages.logout);
router.route("/admin/sendemail").post(renderAuthPages.forgotsendemail);
router
  .route("/admin/forgotpassword/:token")
  .post(renderAuthPages.forgotrestpassword);
router.route("/admin/refrestoken").post(renderAuthPages.refreshToken);

module.exports = router;
