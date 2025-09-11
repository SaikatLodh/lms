const courseController = require("../../../controllers/course/ejs/renderAdminCoursePages");
const adminVerifyJwt = require("../../../middleware/adminMiddleware");
const adminCheckRoles = require("../../../middleware/AdminPermissionMiddleware");
const upload = require("../../../middleware/multer");
const express = require("express");

const router = express.Router();

router
  .route("/managecourses")
  .get(
    adminVerifyJwt,
    adminCheckRoles(["admin"]),
    courseController.renderCoursePage
  );

router
  .route("/managesinglecourses/:id")
  .get(
    adminVerifyJwt,
    adminCheckRoles(["admin"]),
    courseController.renderSingelCourse
  );

router
  .route("/admin/updateCourse")
  .post(
    adminVerifyJwt,
    adminCheckRoles(["admin"]),
    upload.single("courseImage"),
    courseController.updateCourse
  );

router
  .route("/admin/deleteCourse/:id")
  .post(
    adminVerifyJwt,
    adminCheckRoles(["admin"]),
    courseController.deleteCourse
  );

module.exports = router;
