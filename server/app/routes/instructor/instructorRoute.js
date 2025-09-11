const instructorController = require("../../controllers/instructor/instructor");
const verifyJwt = require("../../middleware/authMiddleware");
const checkRoles = require("../../middleware/checkPermissionMiddleware");
const express = require("express");

const router = express.Router();

router
  .route("/getinstructordashboard")
  .get(
    verifyJwt,
    checkRoles(["instructor"]),
    instructorController.getInstructorDashboard
  );

router
  .route("/getinstructorcourse")
  .get(
    verifyJwt,
    checkRoles(["instructor"]),
    instructorController.getInstructorCourse
  );

router
  .route("/getinstructororderorders")
  .get(
    verifyJwt,
    checkRoles(["instructor"]),
    instructorController.getInstructororderOrders
  );

module.exports = router;
