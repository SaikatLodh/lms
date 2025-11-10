const reviewController = require("../../controllers/review/reviewController");
const verifyJwt = require("../../middleware/authMiddleware");
const checkRoles = require("../../middleware/checkPermissionMiddleware");
const express = require("express");

const router = express.Router();

/**
 * @swagger
 * /review/createreview:
 *   post:
 *     summary: Create a review
 *     tags: [Reviews]
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
 *               rating:
 *                 type: number
 *                 minimum: 1
 *                 maximum: 5
 *                 example: 4
 *               comment:
 *                 type: string
 *                 example: Great course!
 *     responses:
 *       201:
 *         description: Review created successfully
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden
 */
router
  .route("/createreview")
  .post(
    verifyJwt,
    checkRoles(["user", "instructor"]),
    reviewController.createReview
  );

/**
 * @swagger
 * /review/getreview/{id}:
 *   get:
 *     summary: Get reviews for a course
 *     tags: [Reviews]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Reviews retrieved successfully
 */
router.route("/getreview/:id").get(reviewController.getReviewByCourse);

/**
 * @swagger
 * /review/getsinglereview/{id}:
 *   get:
 *     summary: Get single review
 *     tags: [Reviews]
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
 *         description: Review retrieved successfully
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden
 *       404:
 *         description: Review not found
 */
router
  .route("/getsinglereview/:id")
  .get(
    verifyJwt,
    checkRoles(["user", "instructor"]),
    reviewController.getSingleReview
  );

/**
 * @swagger
 * /review/updatereview/{id}:
 *   patch:
 *     summary: Update review
 *     tags: [Reviews]
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
 *               rating:
 *                 type: number
 *                 minimum: 1
 *                 maximum: 5
 *                 example: 5
 *               comment:
 *                 type: string
 *                 example: Excellent course!
 *     responses:
 *       200:
 *         description: Review updated successfully
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden
 *       404:
 *         description: Review not found
 */
router
  .route("/updatereview/:id")
  .patch(
    verifyJwt,
    checkRoles(["user", "instructor"]),
    reviewController.updateReview
  );

/**
 * @swagger
 * /review/deletereview/{id}:
 *   delete:
 *     summary: Delete review
 *     tags: [Reviews]
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
 *         description: Review deleted successfully
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden
 *       404:
 *         description: Review not found
 */
router
  .route("/deletereview/:id")
  .delete(
    verifyJwt,
    checkRoles(["user", "instructor"]),
    reviewController.deleteReview
  );

module.exports = router;
