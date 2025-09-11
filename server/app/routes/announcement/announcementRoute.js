const announcementController = require("../../controllers/announcement/announcementController");
const verifyJwt = require("../../middleware/authMiddleware");
const checkRoles = require("../../middleware/checkPermissionMiddleware");
const express = require("express");

const router = express.Router();

router
  .route("/createannouncement")
  .post(
    verifyJwt,
    checkRoles(["instructor"]),
    announcementController.createAnnouncement
  );

router
  .route("/getannouncementbycourse/:id")
  .get(
    verifyJwt,
    checkRoles(["instructor", "user"]),
    announcementController.getAnnouncementByCourse
  );

router
  .route("/getsingleannouncement/:id")
  .get(
    verifyJwt,
    checkRoles(["instructor"]),
    announcementController.getSingleAnnouncement
  );

router
  .route("/updateannouncement/:id")
  .patch(
    verifyJwt,
    checkRoles(["instructor"]),
    announcementController.updateAnnouncement
  );

router
  .route("/deleteannouncement/:id")
  .delete(
    verifyJwt,
    checkRoles(["instructor"]),
    announcementController.deleteAnnouncement
  );

module.exports = router;
