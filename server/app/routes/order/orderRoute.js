const orderController = require("../../controllers/order/orderController");
const verifyJwt = require("../../middleware/authMiddleware");
const checkRoles = require("../../middleware/checkPermissionMiddleware");
const express = require("express");

const router = express.Router();

/**
 * @swagger
 * /order/createorder:
 *   post:
 *     summary: Create an order
 *     tags: [Orders]
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
 *               amount:
 *                 type: number
 *                 example: 99.99
 *     responses:
 *       201:
 *         description: Order created successfully
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden
 */
router
  .route("/createorder")
  .post(
    verifyJwt,
    checkRoles(["user", "instructor"]),
    orderController.createOrder
  );

/**
 * @swagger
 * /order/getkeys:
 *   get:
 *     summary: Get payment keys
 *     tags: [Orders]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Payment keys retrieved successfully
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden
 */
router
  .route("/getkeys")
  .get(verifyJwt, checkRoles(["user", "instructor"]), orderController.getKeys);

/**
 * @swagger
 * /order/getpaymentprocess/{id}:
 *   post:
 *     summary: Process payment for single course
 *     tags: [Orders]
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
 *               razorpay_payment_id:
 *                 type: string
 *                 example: pay_1234567890
 *               razorpay_order_id:
 *                 type: string
 *                 example: order_1234567890
 *               razorpay_signature:
 *                 type: string
 *                 example: signature_hash
 *     responses:
 *       200:
 *         description: Payment processed successfully
 *       400:
 *         description: Bad request
 */
router.route("/getpaymentprocess/:id").post(orderController.getPaymentProcess);

/**
 * @swagger
 * /order/getpaymentprocessforcart:
 *   post:
 *     summary: Process payment for cart items
 *     tags: [Orders]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               razorpay_payment_id:
 *                 type: string
 *                 example: pay_1234567890
 *               razorpay_order_id:
 *                 type: string
 *                 example: order_1234567890
 *               razorpay_signature:
 *                 type: string
 *                 example: signature_hash
 *               cartItems:
 *                 type: array
 *                 items:
 *                   type: string
 *                 example: ["courseId1", "courseId2"]
 *     responses:
 *       200:
 *         description: Payment processed successfully
 *       400:
 *         description: Bad request
 */
router
  .route("/getpaymentprocessforcart")
  .post(orderController.getPaymentProcessForCart);

module.exports = router;
