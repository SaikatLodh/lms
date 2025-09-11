const scheduleController = require("../../controllers/schedule/scheduleController");
const verifyJwt = require("../../middleware/authMiddleware");
const checkRoles = require("../../middleware/checkPermissionMiddleware");
const express = require("express");

const router = express.Router();

router
  .route("/createschedule")
  .post(
    verifyJwt,
    checkRoles(["user", "instructor"]),
    scheduleController.createSchedule
  );

router
  .route("/getschedule")
  .get(
    verifyJwt,
    checkRoles(["user", "instructor"]),
    scheduleController.getSchedule
  );

router
  .route("/getsingleschedule/:scheduleId")
  .get(
    verifyJwt,
    checkRoles(["user", "instructor"]),
    scheduleController.getSingleSchedule
  );

router
  .route("/updateschedule/:scheduleId")
  .patch(
    verifyJwt,
    checkRoles(["user", "instructor"]),
    scheduleController.updateSchedule
  );

router
  .route("/liveschedule/:scheduleId")
  .get(
    verifyJwt,
    checkRoles(["user", "instructor"]),
    scheduleController.liveStatus
  );

module.exports = router;
