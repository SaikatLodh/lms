const orderController = require("../../controllers/order/orderController");
const verifyJwt = require("../../middleware/authMiddleware");
const checkRoles = require("../../middleware/checkPermissionMiddleware");
const express = require("express");

const router = express.Router();

router
  .route("/createorder")
  .post(
    verifyJwt,
    checkRoles(["user", "instructor"]),
    orderController.createOrder
  );

router
  .route("/getkeys")
  .get(verifyJwt, checkRoles(["user", "instructor"]), orderController.getKeys);

router.route("/getpaymentprocess/:id").post(orderController.getPaymentProcess);

router
  .route("/getpaymentprocessforcart")
  .post(orderController.getPaymentProcessForCart);

module.exports = router;
