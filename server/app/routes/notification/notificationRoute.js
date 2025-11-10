const notificationController = require("../../controllers/notification/notificationController");
const verifyJwt = require("../../middleware/authMiddleware");
const checkRoles = require("../../middleware/checkPermissionMiddleware");
const express = require("express");

const router = express.Router();

/**
 * @swagger
 * /notification/getnotifications:
 *   get:
 *     summary: Get user notifications
 *     tags: [Notifications]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Notifications retrieved successfully
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden
 */
router
  .route("/getnotifications")
  .get(
    verifyJwt,
    checkRoles(["user", "instructor"]),
    notificationController.getNotifications
  );

/**
 * @swagger
 * /notification/seennotification/{id}:
 *   get:
 *     summary: Mark notification as seen
 *     tags: [Notifications]
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
 *         description: Notification marked as seen successfully
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden
 *       404:
 *         description: Notification not found
 */
router
  .route("/seennotification/:id")
  .get(
    verifyJwt,
    checkRoles(["user", "instructor"]),
    notificationController.seenNotification
  );

module.exports = router;
