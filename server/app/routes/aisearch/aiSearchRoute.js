const aiSearchController = require("../../controllers/aisearch/aiSearch");
const verifyJwt = require("../../middleware/authMiddleware");
const checkRoles = require("../../middleware/checkPermissionMiddleware");
const router = require("express").Router();

/**
 * @swagger
 * /aisearch/getaisearch:
 *   get:
 *     summary: Get AI search results
 *     tags: [AI Search]
 *     parameters:
 *       - in: query
 *         name: query
 *         required: true
 *         schema:
 *           type: string
 *         example: machine learning courses
 *     responses:
 *       200:
 *         description: AI search results retrieved successfully
 *       400:
 *         description: Bad request
 */
router.route("/getaisearch").get(aiSearchController.getAISearch);

module.exports = router;
