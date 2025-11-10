const announcementController = require("../../controllers/announcement/announcementController");
const verifyJwt = require("../../middleware/authMiddleware");
const checkRoles = require("../../middleware/checkPermissionMiddleware");
const express = require("express");

const router = express.Router();

/**
 * @swagger
 * /announcement/createannouncement:
 *   post:
 *     summary: Create an announcement
 *     tags: [Announcements]
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
 *               title:
 *                 type: string
 *                 example: Important Update
 *               message:
 *                 type: string
 *                 example: The course schedule has been updated
 *     responses:
 *       201:
 *         description: Announcement created successfully
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden
 */
router
  .route("/createannouncement")
  .post(
    verifyJwt,
    checkRoles(["instructor"]),
    announcementController.createAnnouncement
  );

/**
 * @swagger
 * /announcement/getannouncementbycourse/{id}:
 *   get:
 *     summary: Get announcements by course
 *     tags: [Announcements]
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
 *         description: Announcements retrieved successfully
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden
 */
router
  .route("/getannouncementbycourse/:id")
  .get(
    verifyJwt,
    checkRoles(["instructor", "user"]),
    announcementController.getAnnouncementByCourse
  );

/**
 * @swagger
 * /announcement/getsingleannouncement/{id}:
 *   get:
 *     summary: Get single announcement
 *     tags: [Announcements]
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
 *         description: Announcement retrieved successfully
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden
 *       404:
 *         description: Announcement not found
 */
router
  .route("/getsingleannouncement/:id")
  .get(
    verifyJwt,
    checkRoles(["instructor"]),
    announcementController.getSingleAnnouncement
  );

/**
 * @swagger
 * /announcement/updateannouncement/{id}:
 *   patch:
 *     summary: Update announcement
 *     tags: [Announcements]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
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
 *                 example: Updated Announcement
 *               message:
 *                 type: string
 *                 example: Updated message content
 *     responses:
 *       200:
 *         description: Announcement updated successfully
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden
 *       404:
 *         description: Announcement not found
 */
router
  .route("/updateannouncement/:id")
  .patch(
    verifyJwt,
    checkRoles(["instructor"]),
    announcementController.updateAnnouncement
  );

/**
 * @swagger
 * /announcement/deleteannouncement/{id}:
 *   delete:
 *     summary: Delete announcement
 *     tags: [Announcements]
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
 *         description: Announcement deleted successfully
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden
 *       404:
 *         description: Announcement not found
 */
router
  .route("/deleteannouncement/:id")
  .delete(
    verifyJwt,
    checkRoles(["instructor"]),
    announcementController.deleteAnnouncement
  );

module.exports = router;
