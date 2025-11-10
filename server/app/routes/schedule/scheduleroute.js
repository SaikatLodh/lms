const scheduleController = require("../../controllers/schedule/scheduleController");
const verifyJwt = require("../../middleware/authMiddleware");
const checkRoles = require("../../middleware/checkPermissionMiddleware");
const express = require("express");

const router = express.Router();

/**
 * @swagger
 * /schedule/createschedule:
 *   post:
 *     summary: Create a schedule
 *     tags: [Schedules]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *                 example: Weekly Class Schedule
 *               description:
 *                 type: string
 *                 example: Regular class timings
 *               startTime:
 *                 type: string
 *                 format: date-time
 *                 example: 2023-12-01T09:00:00Z
 *               endTime:
 *                 type: string
 *                 format: date-time
 *                 example: 2023-12-01T10:00:00Z
 *               courseId:
 *                 type: string
 *                 example: 60d5ecb74b24c72b8c8b4567
 *     responses:
 *       201:
 *         description: Schedule created successfully
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden
 */
router
  .route("/createschedule")
  .post(
    verifyJwt,
    checkRoles(["user", "instructor"]),
    scheduleController.createSchedule
  );

/**
 * @swagger
 * /schedule/getschedule:
 *   get:
 *     summary: Get user schedules
 *     tags: [Schedules]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Schedules retrieved successfully
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden
 */
router
  .route("/getschedule")
  .get(
    verifyJwt,
    checkRoles(["user", "instructor"]),
    scheduleController.getSchedule
  );

/**
 * @swagger
 * /schedule/getsingleschedule/{scheduleId}:
 *   get:
 *     summary: Get single schedule
 *     tags: [Schedules]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: scheduleId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Schedule retrieved successfully
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden
 *       404:
 *         description: Schedule not found
 */
router
  .route("/getsingleschedule/:scheduleId")
  .get(
    verifyJwt,
    checkRoles(["user", "instructor"]),
    scheduleController.getSingleSchedule
  );

/**
 * @swagger
 * /schedule/updateschedule/{scheduleId}:
 *   patch:
 *     summary: Update schedule
 *     tags: [Schedules]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: scheduleId
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *                 example: Updated Schedule Title
 *               description:
 *                 type: string
 *                 example: Updated description
 *               startTime:
 *                 type: string
 *                 format: date-time
 *                 example: 2023-12-01T10:00:00Z
 *               endTime:
 *                 type: string
 *                 format: date-time
 *                 example: 2023-12-01T11:00:00Z
 *     responses:
 *       200:
 *         description: Schedule updated successfully
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden
 *       404:
 *         description: Schedule not found
 */
router
  .route("/updateschedule/:scheduleId")
  .patch(
    verifyJwt,
    checkRoles(["user", "instructor"]),
    scheduleController.updateSchedule
  );

/**
 * @swagger
 * /schedule/liveschedule/{scheduleId}:
 *   get:
 *     summary: Get live status of schedule
 *     tags: [Schedules]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: scheduleId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Live status retrieved successfully
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden
 *       404:
 *         description: Schedule not found
 */
router
  .route("/liveschedule/:scheduleId")
  .get(
    verifyJwt,
    checkRoles(["user", "instructor"]),
    scheduleController.liveStatus
  );

module.exports = router;
