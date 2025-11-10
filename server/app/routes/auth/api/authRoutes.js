const express = require("express");
const authController = require("../../../controllers/auth/api/authController");
const verifyJwt = require("../../../middleware/authMiddleware");
const router = express.Router();

/**
 * @swagger
 * /auth/sendotp:
 *   post:
 *     summary: Send OTP to user
 *     tags: [Authentication]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *                 example: user@example.com
 *     responses:
 *       200:
 *         description: OTP sent successfully
 *       400:
 *         description: Bad request
 */
router.route("/sendotp").post(authController.sendOtp);

/**
 * @swagger
 * /auth/verifyotp:
 *   post:
 *     summary: Verify OTP
 *     tags: [Authentication]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *                 example: user@example.com
 *               otp:
 *                 type: string
 *                 example: "123456"
 *     responses:
 *       200:
 *         description: OTP verified successfully
 *       400:
 *         description: Invalid OTP
 */
router.route("/verifyotp").post(authController.verifyOtp);

/**
 * @swagger
 * /auth/register:
 *   post:
 *     summary: Register a new user
 *     tags: [Authentication]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 example: John Doe
 *               email:
 *                 type: string
 *                 example: user@example.com
 *               password:
 *                 type: string
 *                 example: password123
 *     responses:
 *       201:
 *         description: User registered successfully
 *       400:
 *         description: Bad request
 */
router.route("/register").post(authController.register);

/**
 * @swagger
 * /auth/login:
 *   post:
 *     summary: Login user
 *     tags: [Authentication]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *                 example: user@example.com
 *               password:
 *                 type: string
 *                 example: password123
 *     responses:
 *       200:
 *         description: Login successful
 *       401:
 *         description: Unauthorized
 */
router.route("/login").post(authController.login);

/**
 * @swagger
 * /auth/logout:
 *   get:
 *     summary: Logout user
 *     tags: [Authentication]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Logout successful
 *       401:
 *         description: Unauthorized
 */
router.route("/logout").get(verifyJwt, authController.logout);

/**
 * @swagger
 * /auth/forgotsendemail:
 *   post:
 *     summary: Send forgot password email
 *     tags: [Authentication]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *                 example: user@example.com
 *     responses:
 *       200:
 *         description: Email sent successfully
 *       400:
 *         description: Bad request
 */
router.route("/forgotsendemail").post(authController.forgotsendemail);

/**
 * @swagger
 * /auth/forgotresetpassword/{token}:
 *   post:
 *     summary: Reset password with token
 *     tags: [Authentication]
 *     parameters:
 *       - in: path
 *         name: token
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
 *               password:
 *                 type: string
 *                 example: newpassword123
 *     responses:
 *       200:
 *         description: Password reset successfully
 *       400:
 *         description: Invalid token
 */
router
  .route("/forgotresetpassword/:token")
  .post(authController.forgotrestpassword);

/**
 * @swagger
 * /auth/googlesignup:
 *   get:
 *     summary: Google signup
 *     tags: [Authentication]
 *     responses:
 *       200:
 *         description: Redirect to Google
 */
router.route("/googlesignup").get(authController.googlesignup);

/**
 * @swagger
 * /auth/googlesignin:
 *   get:
 *     summary: Google signin
 *     tags: [Authentication]
 *     responses:
 *       200:
 *         description: Redirect to Google
 */
router.route("/googlesignin").get(authController.googlesignin);

/**
 * @swagger
 * /auth/facebooksignup:
 *   post:
 *     summary: Facebook signup
 *     tags: [Authentication]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               accessToken:
 *                 type: string
 *     responses:
 *       201:
 *         description: User registered via Facebook
 *       400:
 *         description: Bad request
 */
router.route("/facebooksignup").post(authController.facebookSignup);

/**
 * @swagger
 * /auth/facebooksignin:
 *   post:
 *     summary: Facebook signin
 *     tags: [Authentication]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               accessToken:
 *                 type: string
 *     responses:
 *       200:
 *         description: Login successful
 *       401:
 *         description: Unauthorized
 */
router.route("/facebooksignin").post(authController.facebookSignin);

/**
 * @swagger
 * /auth/refreshtoken:
 *   get:
 *     summary: Refresh access token
 *     tags: [Authentication]
 *     responses:
 *       200:
 *         description: Token refreshed
 *       401:
 *         description: Unauthorized
 */
router.route("/refreshtoken").get(authController.refresToken);

module.exports = router;
