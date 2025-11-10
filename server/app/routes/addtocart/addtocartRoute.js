const addtocartController = require("../../controllers/addtocart/addToCartController");
const verifyJwt = require("../../middleware/authMiddleware");
const checkRoles = require("../../middleware/checkPermissionMiddleware");
const express = require("express");

const router = express.Router();

/**
 * @swagger
 * /addtocart/addtocartandremovecart/{courseId}:
 *   get:
 *     summary: Add or remove course from cart
 *     tags: [Cart]
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
 *         description: Course added/removed from cart successfully
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden
 */
router
  .route("/addtocartandremovecart/:courseId")
  .get(
    verifyJwt,
    checkRoles(["user", "instructor"]),
    addtocartController.addtoCartAndRemoveCart
  );

/**
 * @swagger
 * /addtocart/getcart:
 *   get:
 *     summary: Get user's cart
 *     tags: [Cart]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Cart retrieved successfully
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden
 */
router
  .route("/getcart")
  .get(
    verifyJwt,
    checkRoles(["user", "instructor"]),
    addtocartController.getCart
  );

module.exports = router;
