const instructorController = require("../../controllers/instructor/instructor");
const verifyJwt = require("../../middleware/authMiddleware");
const checkRoles = require("../../middleware/checkPermissionMiddleware");
const express = require("express");

const router = express.Router();

/**
 * @swagger
 * /instructor/getinstructordashboard:
 *   get:
 *     summary: Get instructor dashboard data
 *     tags: [Instructor]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Instructor dashboard data retrieved successfully
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden
 */
router
  .route("/getinstructordashboard")
  .get(
    verifyJwt,
    checkRoles(["instructor"]),
    instructorController.getInstructorDashboard
  );

/**
 * @swagger
 * /instructor/getinstructorcourse:
 *   get:
 *     summary: Get instructor's courses
 *     tags: [Instructor]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Instructor courses retrieved successfully
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden
 */
router
  .route("/getinstructorcourse")
  .get(
    verifyJwt,
    checkRoles(["instructor"]),
    instructorController.getInstructorCourse
  );

/**
 * @swagger
 * /instructor/getinstructororderorders:
 *   get:
 *     summary: Get instructor's orders
 *     tags: [Instructor]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Instructor orders retrieved successfully
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden
 */
router
  .route("/getinstructororderorders")
  .get(
    verifyJwt,
    checkRoles(["instructor"]),
    instructorController.getInstructororderOrders
  );

module.exports = router;
