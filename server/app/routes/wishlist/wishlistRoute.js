const WishListController = require("../../controllers/wishlist/wishlistController");
const verifyJwt = require("../../middleware/authMiddleware");
const checkRoles = require("../../middleware/checkPermissionMiddleware");
const express = require("express");

const router = express.Router();

router
  .route("/addtowishListandremovecart/:courseId")
  .get(
    verifyJwt,
    checkRoles(["user", "instructor"]),
    WishListController.addtoWishListAndRemoveCart
  );
router
  .route("/getwishlist")
  .get(
    verifyJwt,
    checkRoles(["user", "instructor"]),
    WishListController.getWishList
  );

module.exports = router;
