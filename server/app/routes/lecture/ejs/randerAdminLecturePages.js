const lectureController = require("../../../controllers/lecture/ejs/renderAdminLecturePages");
const adminVerifyJwt = require("../../../middleware/adminMiddleware");
const adminCheckRoles = require("../../../middleware/AdminPermissionMiddleware");
const upload = require("../../../middleware/multer");
const express = require("express");

const router = express.Router();

router
  .route("/managelectures/:courseid")
  .get(
    adminVerifyJwt,
    adminCheckRoles(["admin"]),
    lectureController.renderLecturePage
  );

router
  .route("/managesinglelecture/:lectureid")
  .get(
    adminVerifyJwt,
    adminCheckRoles(["admin"]),
    lectureController.renderSingleLecture
  );

router
  .route("/admin/updateLecture")
  .post(
    adminVerifyJwt,
    adminCheckRoles(["admin"]),
    upload.single("lectureVideo"),
    lectureController.updateLecture
  );

router
  .route("/admin/deleteLecture/:courseId/:lectureId")
  .post(
    adminVerifyJwt,
    adminCheckRoles(["admin"]),
    lectureController.deleteLecture
  );

module.exports = router;
