const lectureController = require("../../../controllers/lecture/api/lectureContoller");
const verifyJwt = require("../../../middleware/authMiddleware");
const checkRoles = require("../../../middleware/checkPermissionMiddleware");
const upload = require("../../../middleware/multer");
const express = require("express");

const router = express.Router();

router
  .route("/createlecturewithbulk")
  .post(
    verifyJwt,
    checkRoles(["instructor"]),
    upload.fields([{ name: "lectureVideos", maxCount: 5 }]),
    lectureController.createLectureWithBulk
  );

router
  .route("/createlecture")
  .post(
    verifyJwt,
    checkRoles(["instructor"]),
    upload.single("lectureVideo"),
    lectureController.createLecture
  );
router
  .route("/getlecturebylecturer/:courseId")
  .get(
    verifyJwt,
    checkRoles(["instructor", "admin"]),
    lectureController.getLecturesByLecturer
  );

router
  .route("/getLectureById/:id")
  .get(
    verifyJwt,
    checkRoles(["instructor", "admin"]),
    lectureController.getLectureById
  );

router
  .route("/updatelecture")
  .patch(
    verifyJwt,
    checkRoles(["instructor", "admin"]),
    upload.single("lectureVideo"),
    lectureController.updateLecture
  );

router
  .route("/deletelecture/:courseId/:lectureId")
  .delete(
    verifyJwt,
    checkRoles(["instructor", "admin"]),
    lectureController.deleteLecture
  );

router
  .route("/togglefreepreview/:lectureId")
  .get(
    verifyJwt,
    checkRoles(["instructor"]),
    lectureController.toggleFreePreview
  );

module.exports = router;
