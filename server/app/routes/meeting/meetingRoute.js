const meetingController = require("../../controllers/meeting/meetingController");
const verifyJwt = require("../../middleware/authMiddleware");
const checkRoles = require("../../middleware/checkPermissionMiddleware");

const express = require("express");
const router = express.Router();

router
  .route("/createmeeting")
  .post(
    verifyJwt,
    checkRoles(["user", "instructor"]),
    meetingController.createMeeting
  );

router
  .route("/getmeeting/:meetingId")
  .get(
    verifyJwt,
    checkRoles(["user", "instructor"]),
    meetingController.getSingleMeeting
  );

router
  .route("/updatemeeting/:scheduleId/:meetingId")
  .get(
    verifyJwt,
    checkRoles(["user", "instructor"]),
    meetingController.updateMeeting
  );

module.exports = router;
