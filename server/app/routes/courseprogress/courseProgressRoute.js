const CourseProgressController = require("../../controllers/courseprogress/courseProgress");
const verifyJwt = require("../../middleware/authMiddleware");
const checkRoles = require("../../middleware/checkPermissionMiddleware");
const express = require("express");

const router = express.Router();

/**
 * @swagger
 * /courseprogress/getlectureprogress/{id}:
 *   get:
 *     summary: Get lecture progress for a course
 *     tags: [Course Progress]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Lecture progress retrieved successfully
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden
 */
router
  .route("/getlectureprogress/:id")
  .get(
    verifyJwt,
    checkRoles(["user", "instructor"]),
    CourseProgressController.getLectureProgress
  );

/**
 * @swagger
 * /courseprogress/getsinglelectureprogress/{id}:
 *   get:
 *     summary: Get single lecture progress
 *     tags: [Course Progress]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Single lecture progress retrieved successfully
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden
 */
router
  .route("/getsinglelectureprogress/:id")
  .get(
    verifyJwt,
    checkRoles(["user", "instructor"]),
    CourseProgressController.getSingleLectureProgress
  );

/**
 * @swagger
 * /courseprogress/markcurrentLectureasviewed/{courseId}/{lectureId}:
 *   get:
 *     summary: Mark current lecture as viewed
 *     tags: [Course Progress]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: courseId
 *         required: true
 *         schema:
 *           type: string
 *       - in: path
 *         name: lectureId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Lecture marked as viewed successfully
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden
 */
router
  .route("/markcurrentLectureasviewed/:courseId/:lectureId")
  .get(
    verifyJwt,
    checkRoles(["user", "instructor"]),
    CourseProgressController.markCurrentLectureAsViewed
  );

/**
 * @swagger
 * /courseprogress/getCurrentCourseProgress/{id}:
 *   get:
 *     summary: Get current course progress
 *     tags: [Course Progress]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Current course progress retrieved successfully
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden
 */
router
  .route("/getCurrentCourseProgress/:id")
  .get(
    verifyJwt,
    checkRoles(["user", "instructor"]),
    CourseProgressController.getCurrentCourseProgress
  );

/**
 * @swagger
 * /courseprogress/resetcurrentcourseprogress/{id}:
 *   get:
 *     summary: Reset current course progress
 *     tags: [Course Progress]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Course progress reset successfully
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden
 */
router
  .route("/resetcurrentcourseprogress/:id")
  .get(
    verifyJwt,
    checkRoles(["user", "instructor"]),
    CourseProgressController.resetCurrentCourseProgress
  );

module.exports = router;
