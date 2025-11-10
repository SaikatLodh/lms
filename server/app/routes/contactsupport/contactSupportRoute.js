const contactSupportController = require("../../controllers/contactsupport/contactSupportController");
const verifyJwt = require("../../middleware/authMiddleware");
const checkRoles = require("../../middleware/checkPermissionMiddleware");
const express = require("express");
const router = express.Router();

/**
 * @swagger
 * /contactsupport/createcontactsupport:
 *   post:
 *     summary: Create a contact support request
 *     tags: [Contact Support]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               subject:
 *                 type: string
 *                 example: Technical Issue
 *               message:
 *                 type: string
 *                 example: I am having trouble accessing my course
 *               category:
 *                 type: string
 *                 example: technical
 *     responses:
 *       201:
 *         description: Contact support request created successfully
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden
 */
router
  .route("/createcontactsupport")
  .post(
    verifyJwt,
    checkRoles(["user", "instructor"]),
    contactSupportController.createContactSupport
  );

/**
 * @swagger
 * /contactsupport/getcontactsupport:
 *   get:
 *     summary: Get all contact support requests
 *     tags: [Contact Support]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Contact support requests retrieved successfully
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden
 */
router
  .route("/getcontactsupport")
  .get(
    verifyJwt,
    checkRoles(["admin"]),
    contactSupportController.getContactSupport
  );

module.exports = router;
