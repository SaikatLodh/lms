const adminController = require("../../../controllers/admin/api/adminController");
const verifyJwt = require("../../../middleware/authMiddleware");
const checkRoles = require("../../../middleware/checkPermissionMiddleware");
const express = require("express");

const router = express.Router();

/**
 * @swagger
 * /admin/getdashboarddata:
 *   get:
 *     summary: Get admin dashboard data
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Dashboard data retrieved successfully
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden
 */
router
  .route("/getdashboarddata")
  .get(verifyJwt, checkRoles(["admin"]), adminController.getDashboardData);

/**
 * @swagger
 * /admin/createlecture:
 *   post:
 *     summary: Create a lecture (Admin)
 *     tags: [Admin]
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
  .post(verifyJwt, checkRoles(["admin"]), adminController.createLecture);

/**
 * @swagger
 * /admin/getallusers:
 *   get:
 *     summary: Get all users
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Users retrieved successfully
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden
 */
router
  .route("/getallusers")
  .get(verifyJwt, checkRoles(["admin"]), adminController.getAllUsers);

/**
 * @swagger
 * /admin/getallcourses:
 *   get:
 *     summary: Get all courses
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Courses retrieved successfully
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden
 */
router
  .route("/getallcourses")
  .get(verifyJwt, checkRoles(["admin"]), adminController.getAllCourses);

/**
 * @swagger
 * /admin/getallorders:
 *   get:
 *     summary: Get all orders
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Orders retrieved successfully
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden
 */
router
  .route("/getallorders")
  .get(verifyJwt, checkRoles(["admin"]), adminController.getAllOrders);

module.exports = router;
