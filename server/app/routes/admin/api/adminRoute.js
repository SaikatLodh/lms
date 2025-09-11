const adminController = require("../../../controllers/admin/api/adminController");
const verifyJwt = require("../../../middleware/authMiddleware");
const checkRoles = require("../../../middleware/checkPermissionMiddleware");
const express = require("express");

const router = express.Router();

router
  .route("/getdashboarddata")
  .get(verifyJwt, checkRoles(["admin"]), adminController.getDashboardData);

router
  .route("/createlecture")
  .post(verifyJwt, checkRoles(["admin"]), adminController.createLecture);

router
  .route("/getallusers")
  .get(verifyJwt, checkRoles(["admin"]), adminController.getAllUsers);

router
  .route("/getallcourses")
  .get(verifyJwt, checkRoles(["admin"]), adminController.getAllCourses);

router
  .route("/getallorders")
  .get(verifyJwt, checkRoles(["admin"]), adminController.getAllOrders);

module.exports = router;
