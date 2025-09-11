const aiSearchController = require("../../controllers/aisearch/aiSearch");
const verifyJwt = require("../../middleware/authMiddleware");
const checkRoles = require("../../middleware/checkPermissionMiddleware");
const router = require("express").Router();

router.route("/getaisearch").get(aiSearchController.getAISearch);

module.exports = router;
