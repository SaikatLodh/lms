const Course = require("../../models/courseModel");
const HTTP_STATUS_CODE = require("../../config/httpStatusCodes");
const apiResponse = require("../../config/apiResponse");
const apiError = require("../../config/apiError");
const STATUS_CODES = require("../../config/httpStatusCodes");
const generateContent = require("../../helpers/gemini");

class AISearchController {
  async getAISearch(req, res) {
    try {
      const { query } = req.query;

      if (!query) {
        return res
          .status(HTTP_STATUS_CODE.BAD_REQUEST)
          .json(
            new apiError("Query is required", HTTP_STATUS_CODE.BAD_REQUEST)
          );
      }

      const removeDublicateCatefory = await Course.distinct("category", {
        isDeleted: false,
      });

      const removeDublicateLevel = await Course.distinct("level", {
        isDeleted: false,
      });

      const removeDublicateLanguage = await Course.distinct("primaryLanguage", {
        isDeleted: false,
      });

      const removeDublicatePrice = await Course.distinct("pricing", {
        isDeleted: false,
      });

      const removeDublicateInstructor = await Course.distinct(
        "instructorName",
        {
          isDeleted: false,
        }
      );

      const margeCategory = removeDublicateCatefory.concat(
        removeDublicateLevel,
        removeDublicateLanguage,
        removeDublicatePrice,
        removeDublicateInstructor
      );

      const aiResponse = await generateContent(margeCategory, query);

      if (!aiResponse) {
        return res
          .status(HTTP_STATUS_CODE.INTERNAL_SERVER_ERROR)
          .json(
            new apiError(
              "Search failed from AI",
              HTTP_STATUS_CODE.INTERNAL_SERVER_ERROR
            )
          );
      }

      const numericResponse = !isNaN(aiResponse)
        ? Number(aiResponse)
        : aiResponse;

      const result = await Course.find({
        isDeleted: false,
        $or:
          typeof numericResponse === "number"
            ? [
                {
                  instructorName: {
                    $regex: numericResponse.toString(),
                    $options: "i",
                  },
                },
                {
                  title: { $regex: numericResponse.toString(), $options: "i" },
                },
                {
                  description: {
                    $regex: numericResponse.toString(),
                    $options: "i",
                  },
                },
                {
                  subtitle: {
                    $regex: numericResponse.toString(),
                    $options: "i",
                  },
                },
                {
                  category: {
                    $regex: numericResponse.toString(),
                    $options: "i",
                  },
                },
                {
                  level: { $regex: numericResponse.toString(), $options: "i" },
                },
                {
                  primaryLanguage: {
                    $regex: numericResponse.toString(),
                    $options: "i",
                  },
                },
                { pricing: numericResponse },
                {
                  welcomeMessage: {
                    $regex: numericResponse.toString(),
                    $options: "i",
                  },
                },
              ]
            : [
                { instructorName: { $regex: aiResponse, $options: "i" } },
                { title: { $regex: aiResponse, $options: "i" } },
                { description: { $regex: aiResponse, $options: "i" } },
                { subtitle: { $regex: aiResponse, $options: "i" } },
                { category: { $regex: aiResponse, $options: "i" } },
                { level: { $regex: aiResponse, $options: "i" } },
                { primaryLanguage: { $regex: aiResponse, $options: "i" } },
                { welcomeMessage: { $regex: aiResponse, $options: "i" } },
              ],
      }).select(
        "-__v -orders -announcements -lectures -reviews -isPublised -status -isDeleted"
      );

      if (!result) {
        return res
          .status(HTTP_STATUS_CODE.INTERNAL_SERVER_ERROR)
          .json(
            new apiError(
              "Search failed",
              HTTP_STATUS_CODE.INTERNAL_SERVER_ERROR
            )
          );
      }

      return res
        .status(HTTP_STATUS_CODE.OK)
        .json(new apiResponse(HTTP_STATUS_CODE.OK, result, "Search result"));
    } catch (error) {
      return res
        .status(STATUS_CODES.INTERNAL_SERVER_ERROR)
        .json(new apiError(error.message, STATUS_CODES.INTERNAL_SERVER_ERROR));
    }
  }
}

module.exports = new AISearchController();
