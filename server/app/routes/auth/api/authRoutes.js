const express = require("express");
const authController = require("../../../controllers/auth/api/authController");
const verifyJwt = require("../../../middleware/authMiddleware");
const router = express.Router();

router.route("/sendotp").post(authController.sendOtp);
router.route("/verifyotp").post(authController.verifyOtp);
router.route("/register").post(authController.register);
router.route("/login").post(authController.login);
router.route("/logout").get(verifyJwt, authController.logout);
router.route("/forgotsendemail").post(authController.forgotsendemail);
router
  .route("/forgotresetpassword/:token")
  .post(authController.forgotrestpassword);
router.route("/googlesignup").get(authController.googlesignup);
router.route("/googlesignin").get(authController.googlesignin);
router.route("/facebooksignup").post(authController.facebookSignup);
router.route("/facebooksignin").post(authController.facebookSignin);
router.route("/refreshtoken").get(authController.refresToken);

module.exports = router;
