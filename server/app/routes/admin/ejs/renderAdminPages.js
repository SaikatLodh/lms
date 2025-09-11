const renderAdminPages = require("../../../controllers/admin/ejs/renderAdminpages");
const adminVerifyJwt = require("../../../middleware/adminMiddleware");
const adminCheckRoles = require("../../../middleware/AdminPermissionMiddleware");
const upload = require("../../../middleware/multer");
const express = require("express");
const router = express.Router();

router
  .route("/")
  .get(
    adminVerifyJwt,
    adminCheckRoles(["admin"]),
    renderAdminPages.getDashboardData
  );

router
  .route("/createlecture")
  .get(
    adminVerifyJwt,
    adminCheckRoles(["admin"]),
    renderAdminPages.renderCreateLecture
  );

router
  .route("/admin/createlecturer")
  .post(
    adminVerifyJwt,
    adminCheckRoles(["admin"]),
    renderAdminPages.createLecture
  );

router
  .route("/users")
  .get(
    adminVerifyJwt,
    adminCheckRoles(["admin"]),
    renderAdminPages.getAllUsers
  );

router
  .route("/courses")
  .get(
    adminVerifyJwt,
    adminCheckRoles(["admin"]),
    renderAdminPages.getAllCourses
  );

router
  .route("/orders")
  .get(
    adminVerifyJwt,
    adminCheckRoles(["admin"]),
    renderAdminPages.getAllOrders
  );

router
  .route("/contactsupport")
  .get(
    adminVerifyJwt,
    adminCheckRoles(["admin"]),
    renderAdminPages.getContactSupport
  );

router
  .route("/updateprofile")
  .get(
    adminVerifyJwt,
    adminCheckRoles(["admin"]),
    renderAdminPages.renderUpdateProfile
  );

router
  .route("/admin/updateprofile")
  .post(
    adminVerifyJwt,
    adminCheckRoles(["admin"]),
    upload.single("profilePicture"),
    renderAdminPages.updateProfile
  );

router
  .route("/changepassword")
  .get(
    adminVerifyJwt,
    adminCheckRoles(["admin"]),
    renderAdminPages.renderChangePassword
  );

router
  .route("/admin/changepassword")
  .post(
    adminVerifyJwt,
    adminCheckRoles(["admin"]),
    renderAdminPages.changePassword
  );

router
  .route("/admin/seennotification/:id")
  .get(
    adminVerifyJwt,
    adminCheckRoles(["admin"]),
    renderAdminPages.seenNotification
  );

module.exports = router;
