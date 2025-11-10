const meetingController = require("../../controllers/meeting/meetingController");
const verifyJwt = require("../../middleware/authMiddleware");
const checkRoles = require("../../middleware/checkPermissionMiddleware");

const express = require("express");
const router = express.Router();

/**
 * @swagger
 * /meeting/createmeeting:
 *   post:
 *     summary: Create a meeting
 *     tags: [Meetings]
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
 *                 example: Weekly Review Meeting
 *               description:
 *                 type: string
 *                 example: Discuss course progress
 *               startTime:
 *                 type: string
 *                 format: date-time
 *                 example: 2023-12-01T10:00:00Z
 *               endTime:
 *                 type: string
 *                 format: date-time
 *                 example: 2023-12-01T11:00:00Z
 *               participants:
 *                 type: array
 *                 items:
 *                   type: string
 *                 example: ["userId1", "userId2"]
 *     responses:
 *       201:
 *         description: Meeting created successfully
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden
 */
router
  .route("/createmeeting")
  .post(
    verifyJwt,
    checkRoles(["user", "instructor"]),
    meetingController.createMeeting
  );

/**
 * @swagger
 * /meeting/getmeeting/{meetingId}:
 *   get:
 *     summary: Get single meeting
 *     tags: [Meetings]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: meetingId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Meeting retrieved successfully
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden
 *       404:
 *         description: Meeting not found
 */
router
  .route("/getmeeting/:meetingId")
  .get(
    verifyJwt,
    checkRoles(["user", "instructor"]),
    meetingController.getSingleMeeting
  );

/**
 * @swagger
 * /meeting/updatemeeting/{scheduleId}/{meetingId}:
 *   get:
 *     summary: Update meeting
 *     tags: [Meetings]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: scheduleId
 *         required: true
 *         schema:
 *           type: string
 *       - in: path
 *         name: meetingId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Meeting updated successfully
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden
 *       404:
 *         description: Meeting not found
 */
router
  .route("/updatemeeting/:scheduleId/:meetingId")
  .get(
    verifyJwt,
    checkRoles(["user", "instructor"]),
    meetingController.updateMeeting
  );

module.exports = router;
