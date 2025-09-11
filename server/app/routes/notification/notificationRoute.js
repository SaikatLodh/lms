const notificationController = require("../../controllers/notification/notificationController");
const verifyJwt = require("../../middleware/authMiddleware");
const checkRoles = require("../../middleware/checkPermissionMiddleware");
const express = require("express");

const router = express.Router();

router
  .route("/getnotifications")
  .get(
    verifyJwt,
    checkRoles(["user", "instructor"]),
    notificationController.getNotifications
  );

router
  .route("/seennotification/:id")
  .get(
    verifyJwt,
    checkRoles(["user", "instructor"]),
    notificationController.seenNotification
  );

module.exports = router;
