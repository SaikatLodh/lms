const addtocartController = require("../../controllers/addtocart/addToCartController");
const verifyJwt = require("../../middleware/authMiddleware");
const checkRoles = require("../../middleware/checkPermissionMiddleware");
const express = require("express");

const router = express.Router();

router
  .route("/addtocartandremovecart/:courseId")
  .get(
    verifyJwt,
    checkRoles(["user", "instructor"]),
    addtocartController.addtoCartAndRemoveCart
  );
router
  .route("/getcart")
  .get(
    verifyJwt,
    checkRoles(["user", "instructor"]),
    addtocartController.getCart
  );

module.exports = router;
