const CourseProgressController = require("../../controllers/courseprogress/courseProgress");
const verifyJwt = require("../../middleware/authMiddleware");
const checkRoles = require("../../middleware/checkPermissionMiddleware");
const express = require("express");

const router = express.Router();

router
  .route("/getlectureprogress/:id")
  .get(
    verifyJwt,
    checkRoles(["user", "instructor"]),
    CourseProgressController.getLectureProgress
  );

router
  .route("/getsinglelectureprogress/:id")
  .get(
    verifyJwt,
    checkRoles(["user", "instructor"]),
    CourseProgressController.getSingleLectureProgress
  );

router
  .route("/markcurrentLectureasviewed/:courseId/:lectureId")
  .get(
    verifyJwt,
    checkRoles(["user", "instructor"]),
    CourseProgressController.markCurrentLectureAsViewed
  );

router
  .route("/getCurrentCourseProgress/:id")
  .get(
    verifyJwt,
    checkRoles(["user", "instructor"]),
    CourseProgressController.getCurrentCourseProgress
  );

router
  .route("/resetcurrentcourseprogress/:id")
  .get(
    verifyJwt,
    checkRoles(["user", "instructor"]),
    CourseProgressController.resetCurrentCourseProgress
  );

module.exports = router;
