const reviewController = require("../../controllers/review/reviewController");
const verifyJwt = require("../../middleware/authMiddleware");
const checkRoles = require("../../middleware/checkPermissionMiddleware");
const express = require("express");

const router = express.Router();

router
  .route("/createreview")
  .post(
    verifyJwt,
    checkRoles(["user", "instructor"]),
    reviewController.createReview
  );
router.route("/getreview/:id").get(reviewController.getReviewByCourse);
router
  .route("/getsinglereview/:id")
  .get(
    verifyJwt,
    checkRoles(["user", "instructor"]),
    reviewController.getSingleReview
  );
router
  .route("/updatereview/:id")
  .patch(
    verifyJwt,
    checkRoles(["user", "instructor"]),
    reviewController.updateReview
  );
router
  .route("/deletereview/:id")
  .delete(
    verifyJwt,
    checkRoles(["user", "instructor"]),
    reviewController.deleteReview
  );

module.exports = router;
