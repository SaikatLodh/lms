const lectureController = require("../../../controllers/lecture/api/lectureContoller");
const verifyJwt = require("../../../middleware/authMiddleware");
const checkRoles = require("../../../middleware/checkPermissionMiddleware");
const upload = require("../../../middleware/multer");
const express = require("express");

const router = express.Router();

/**
 * @swagger
 * /lecture/createlecturewithbulk:
 *   post:
 *     summary: Create lectures in bulk
 *     tags: [Lectures]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               lectureVideos:
 *                 type: array
 *                 items:
 *                   type: string
 *                   format: binary
 *                 maxItems: 5
 *               titles:
 *                 type: array
 *                 items:
 *                   type: string
 *                 example: ["Lecture 1", "Lecture 2"]
 *               descriptions:
 *                 type: array
 *                 items:
 *                   type: string
 *                 example: ["Description 1", "Description 2"]
 *               courseId:
 *                 type: string
 *                 example: 60d5ecb74b24c72b8c8b4567
 *     responses:
 *       201:
 *         description: Lectures created successfully
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden
 */
router
  .route("/createlecturewithbulk")
  .post(
    verifyJwt,
    checkRoles(["instructor"]),
    upload.fields([{ name: "lectureVideos", maxCount: 5 }]),
    lectureController.createLectureWithBulk
  );

/**
 * @swagger
 * /lecture/createlecture:
 *   post:
 *     summary: Create a single lecture
 *     tags: [Lectures]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               lectureVideo:
 *                 type: string
 *                 format: binary
 *               title:
 *                 type: string
 *                 example: Introduction to Programming
 *               description:
 *                 type: string
 *                 example: Basic concepts of programming
 *               courseId:
 *                 type: string
 *                 example: 60d5ecb74b24c72b8c8b4567
 *     responses:
 *       201:
 *         description: Lecture created successfully
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden
 */
router
  .route("/createlecture")
  .post(
    verifyJwt,
    checkRoles(["instructor"]),
    upload.single("lectureVideo"),
    lectureController.createLecture
  );

/**
 * @swagger
 * /lecture/getlecturebylecturer/{courseId}:
 *   get:
 *     summary: Get lectures by lecturer for a course
 *     tags: [Lectures]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: courseId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Lectures retrieved successfully
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden
 */
router
  .route("/getlecturebylecturer/:courseId")
  .get(
    verifyJwt,
    checkRoles(["instructor", "admin"]),
    lectureController.getLecturesByLecturer
  );

/**
 * @swagger
 * /lecture/getLectureById/{id}:
 *   get:
 *     summary: Get lecture by ID
 *     tags: [Lectures]
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
 *         description: Lecture retrieved successfully
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden
 *       404:
 *         description: Lecture not found
 */
router
  .route("/getLectureById/:id")
  .get(
    verifyJwt,
    checkRoles(["instructor", "admin"]),
    lectureController.getLectureById
  );

/**
 * @swagger
 * /lecture/updatelecture:
 *   patch:
 *     summary: Update lecture
 *     tags: [Lectures]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               lectureVideo:
 *                 type: string
 *                 format: binary
 *               title:
 *                 type: string
 *                 example: Updated Lecture Title
 *               description:
 *                 type: string
 *                 example: Updated description
 *               courseId:
 *                 type: string
 *                 example: 60d5ecb74b24c72b8c8b4567
 *               lectureId:
 *                 type: string
 *                 example: 60d5ecb74b24c72b8c8b4568
 *     responses:
 *       200:
 *         description: Lecture updated successfully
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden
 */
router
  .route("/updatelecture")
  .patch(
    verifyJwt,
    checkRoles(["instructor", "admin"]),
    upload.single("lectureVideo"),
    lectureController.updateLecture
  );

/**
 * @swagger
 * /lecture/deletelecture/{courseId}/{lectureId}:
 *   delete:
 *     summary: Delete lecture
 *     tags: [Lectures]
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
 *         description: Lecture deleted successfully
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden
 *       404:
 *         description: Lecture not found
 */
router
  .route("/deletelecture/:courseId/:lectureId")
  .delete(
    verifyJwt,
    checkRoles(["instructor", "admin"]),
    lectureController.deleteLecture
  );

/**
 * @swagger
 * /lecture/togglefreepreview/{lectureId}:
 *   get:
 *     summary: Toggle free preview for lecture
 *     tags: [Lectures]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: lectureId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Free preview toggled successfully
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden
 */
router
  .route("/togglefreepreview/:lectureId")
  .get(
    verifyJwt,
    checkRoles(["instructor"]),
    lectureController.toggleFreePreview
  );

module.exports = router;
