const userController = require("../../controllers/user/userController");
const verifyJwt = require("../../middleware/authMiddleware");
const checkRoles = require("../../middleware/checkPermissionMiddleware");
const upload = require("../../middleware/multer");
const express = require("express");

const router = express.Router();

router.route("/getuser").get(verifyJwt, userController.getUser);
router
  .route("/updateuser")
  .patch(verifyJwt, upload.single("profilePicture"), userController.updateUser);
router.route("/changepassword").patch(verifyJwt, userController.changePassword);
router.route("/deleteaccount").delete(verifyJwt, userController.deleteAccount);
router
  .route("/mycourses")
  .get(verifyJwt, checkRoles(["user", "instructor"]), userController.myCourses);

module.exports = router;
