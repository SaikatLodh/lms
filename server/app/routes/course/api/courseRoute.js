const courseController = require("../../../controllers/course/api/courseController");
const verifyJwt = require("../../../middleware/authMiddleware");
const upload = require("../../../middleware/multer");
const checkRoles = require("../../../middleware/checkPermissionMiddleware");
const express = require("express");

const router = express.Router();

router
  .route("/createcourse")
  .post(
    verifyJwt,
    checkRoles(["instructor"]),
    upload.single("courseImage"),
    courseController.createCourse
  );
router
  .route("/getcoursebyinstructor")
  .get(
    verifyJwt,
    checkRoles(["instructor"]),
    courseController.getCourseByInstructor
  );
router
  .route("/getsinglecoursebyinstructor/:id")
  .get(
    verifyJwt,
    checkRoles(["instructor"]),
    courseController.getSingleCourseByInstructor
  );
router.route("/getcoursebyuser").get(courseController.getCourseByUser);
router
  .route("/getsinglecoursebyuser/:id")
  .get(courseController.getSingleCourseByUser);
router
  .route("/updateCourse")
  .patch(
    verifyJwt,
    checkRoles(["instructor", "admin"]),
    upload.single("courseImage"),
    courseController.updateCourse
  );
router
  .route("/deletecourse/:id")
  .delete(
    verifyJwt,
    checkRoles(["instructor", "admin"]),
    courseController.deleteCourse
  );
router
  .route("/publishcourse")
  .post(verifyJwt, checkRoles(["instructor"]), courseController.publishCourse);

router
  .route("/suggestedcourses/:courseId")
  .get(courseController.suggestedCourses);

module.exports = router;
