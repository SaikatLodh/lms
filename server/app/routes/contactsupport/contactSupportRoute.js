const contactSupportController = require("../../controllers/contactsupport/contactSupportController");
const verifyJwt = require("../../middleware/authMiddleware");
const checkRoles = require("../../middleware/checkPermissionMiddleware");
const express = require("express");
const router = express.Router();

router
  .route("/createcontactsupport")
  .post(
    verifyJwt,
    checkRoles(["user", "instructor"]),
    contactSupportController.createContactSupport
  );
router
  .route("/getcontactsupport")
  .get(
    verifyJwt,
    checkRoles(["admin"]),
    contactSupportController.getContactSupport
  );

module.exports = router;
