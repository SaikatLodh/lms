const userController = require("../../controllers/user/userController");
const verifyJwt = require("../../middleware/authMiddleware");
const checkRoles = require("../../middleware/checkPermissionMiddleware");
const upload = require("../../middleware/multer");
const express = require("express");

const router = express.Router();

/**
 * @swagger
 * /user/getuser:
 *   get:
 *     summary: Get user profile
 *     tags: [User]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: User profile retrieved successfully
 *       401:
 *         description: Unauthorized
 */
router.route("/getuser").get(verifyJwt, userController.getUser);

/**
 * @swagger
 * /user/updateuser:
 *   patch:
 *     summary: Update user profile
 *     tags: [User]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               profilePicture:
 *                 type: string
 *                 format: binary
 *               name:
 *                 type: string
 *                 example: Updated Name
 *               email:
 *                 type: string
 *                 example: updated@example.com
 *     responses:
 *       200:
 *         description: User profile updated successfully
 *       401:
 *         description: Unauthorized
 */
router
  .route("/updateuser")
  .patch(verifyJwt, upload.single("profilePicture"), userController.updateUser);

/**
 * @swagger
 * /user/changepassword:
 *   patch:
 *     summary: Change user password
 *     tags: [User]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               oldPassword:
 *                 type: string
 *                 example: oldpassword123
 *               newPassword:
 *                 type: string
 *                 example: newpassword123
 *     responses:
 *       200:
 *         description: Password changed successfully
 *       400:
 *         description: Bad request
 *       401:
 *         description: Unauthorized
 */
router.route("/changepassword").patch(verifyJwt, userController.changePassword);

/**
 * @swagger
 * /user/deleteaccount:
 *   delete:
 *     summary: Delete user account
 *     tags: [User]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Account deleted successfully
 *       401:
 *         description: Unauthorized
 */
router.route("/deleteaccount").delete(verifyJwt, userController.deleteAccount);

/**
 * @swagger
 * /user/mycourses:
 *   get:
 *     summary: Get user's enrolled courses
 *     tags: [User]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: User's courses retrieved successfully
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden
 */
router
  .route("/mycourses")
  .get(verifyJwt, checkRoles(["user", "instructor"]), userController.myCourses);

module.exports = router;
