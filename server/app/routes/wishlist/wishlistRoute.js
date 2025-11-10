const WishListController = require("../../controllers/wishlist/wishlistController");
const verifyJwt = require("../../middleware/authMiddleware");
const checkRoles = require("../../middleware/checkPermissionMiddleware");
const express = require("express");

const router = express.Router();

/**
 * @swagger
 * /wishlist/addtowishListandremovecart/{courseId}:
 *   get:
 *     summary: Add or remove course from wishlist
 *     tags: [Wishlist]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: courseId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Course added/removed from wishlist successfully
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden
 */
router
  .route("/addtowishListandremovecart/:courseId")
  .get(
    verifyJwt,
    checkRoles(["user", "instructor"]),
    WishListController.addtoWishListAndRemoveCart
  );

/**
 * @swagger
 * /wishlist/getwishlist:
 *   get:
 *     summary: Get user's wishlist
 *     tags: [Wishlist]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Wishlist retrieved successfully
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden
 */
router
  .route("/getwishlist")
  .get(
    verifyJwt,
    checkRoles(["user", "instructor"]),
    WishListController.getWishList
  );

module.exports = router;
