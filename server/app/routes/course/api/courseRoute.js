const courseController = require("../../../controllers/course/api/courseController");
const verifyJwt = require("../../../middleware/authMiddleware");
const upload = require("../../../middleware/multer");
const checkRoles = require("../../../middleware/checkPermissionMiddleware");
const express = require("express");

const router = express.Router();

/**
 * @swagger
 * /course/createcourse:
 *   post:
 *     summary: Create a new course
 *     tags: [Courses]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               courseImage:
 *                 type: string
 *                 format: binary
 *               title:
 *                 type: string
 *                 example: Introduction to Programming
 *               description:
 *                 type: string
 *                 example: Learn the basics of programming
 *               price:
 *                 type: number
 *                 example: 99.99
 *     responses:
 *       201:
 *         description: Course created successfully
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden
 */
router
  .route("/createcourse")
  .post(
    verifyJwt,
    checkRoles(["instructor"]),
    upload.single("courseImage"),
    courseController.createCourse
  );

/**
 * @swagger
 * /course/getcoursebyinstructor:
 *   get:
 *     summary: Get courses by instructor
 *     tags: [Courses]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Courses retrieved successfully
 *       401:
 *         description: Unauthorized
 */
router
  .route("/getcoursebyinstructor")
  .get(
    verifyJwt,
    checkRoles(["instructor"]),
    courseController.getCourseByInstructor
  );

/**
 * @swagger
 * /course/getsinglecoursebyinstructor/{id}:
 *   get:
 *     summary: Get single course by instructor
 *     tags: [Courses]
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
 *         description: Course retrieved successfully
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Course not found
 */
router
  .route("/getsinglecoursebyinstructor/:id")
  .get(
    verifyJwt,
    checkRoles(["instructor"]),
    courseController.getSingleCourseByInstructor
  );

/**
 * @swagger
 * /course/getcoursebyuser:
 *   get:
 *     summary: Get courses for user
 *     tags: [Courses]
 *     responses:
 *       200:
 *         description: Courses retrieved successfully
 */
router.route("/getcoursebyuser").get(courseController.getCourseByUser);

/**
 * @swagger
 * /course/getsinglecoursebyuser/{id}:
 *   get:
 *     summary: Get single course for user
 *     tags: [Courses]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Course retrieved successfully
 *       404:
 *         description: Course not found
 */
router
  .route("/getsinglecoursebyuser/:id")
  .get(courseController.getSingleCourseByUser);

/**
 * @swagger
 * /course/updateCourse:
 *   patch:
 *     summary: Update course
 *     tags: [Courses]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               courseImage:
 *                 type: string
 *                 format: binary
 *               title:
 *                 type: string
 *                 example: Updated Course Title
 *               description:
 *                 type: string
 *                 example: Updated description
 *               price:
 *                 type: number
 *                 example: 149.99
 *     responses:
 *       200:
 *         description: Course updated successfully
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden
 */
router
  .route("/updateCourse")
  .patch(
    verifyJwt,
    checkRoles(["instructor", "admin"]),
    upload.single("courseImage"),
    courseController.updateCourse
  );

/**
 * @swagger
 * /course/deletecourse/{id}:
 *   delete:
 *     summary: Delete course
 *     tags: [Courses]
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
 *         description: Course deleted successfully
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden
 *       404:
 *         description: Course not found
 */
router
  .route("/deletecourse/:id")
  .delete(
    verifyJwt,
    checkRoles(["instructor", "admin"]),
    courseController.deleteCourse
  );

/**
 * @swagger
 * /course/publishcourse:
 *   post:
 *     summary: Publish course
 *     tags: [Courses]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               courseId:
 *                 type: string
 *                 example: 60d5ecb74b24c72b8c8b4567
 *     responses:
 *       200:
 *         description: Course published successfully
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden
 */
router
  .route("/publishcourse")
  .post(verifyJwt, checkRoles(["instructor"]), courseController.publishCourse);

/**
 * @swagger
 * /course/suggestedcourses/{courseId}:
 *   get:
 *     summary: Get suggested courses
 *     tags: [Courses]
 *     parameters:
 *       - in: path
 *         name: courseId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Suggested courses retrieved successfully
 *       404:
 *         description: Course not found
 */
router
  .route("/suggestedcourses/:courseId")
  .get(courseController.suggestedCourses);

module.exports = router;
