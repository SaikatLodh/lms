const ContactSupport = require("../../models/contactSupportModel");
const User = require("../../models/userModel");
const HTTP_STATUS_CODE = require("../../config/httpStatusCodes");
const apiResponse = require("../../config/apiResponse");
const apiError = require("../../config/apiError");
const {
  createContactSupport,
} = require("../../helpers/validation/contactsupport/contactSupportvalidator");

class ContactSupportController {
  async createContactSupport(req, res) {
    try {
      const { fullName, email, number, subject, message } = req.body;
      const userId = req.user._id;
      const { error } = createContactSupport(req.body);

      if (error) {
        return res
          .status(HTTP_STATUS_CODE.BAD_REQUEST)
          .json(
            new apiError(error.details[0].message, HTTP_STATUS_CODE.BAD_REQUEST)
          );
      }

      const checkEmail = await User.findOne({ email: email });

      if (!checkEmail) {
        return res
          .status(HTTP_STATUS_CODE.NOT_FOUND)
          .json(
            new apiError(
              "You are not send this request",
              HTTP_STATUS_CODE.NOT_FOUND
            )
          );
      }

      const contactSupport = await ContactSupport.create({
        userId,
        fullName,
        email,
        number,
        subject,
        message,
      });

      if (!contactSupport) {
        return res
          .status(HTTP_STATUS_CODE.BAD_REQUEST)
          .json(new apiError("Failed to create contact support", 400));
      }

      return res
        .status(HTTP_STATUS_CODE.CREATED)
        .json(
          new apiResponse(
            HTTP_STATUS_CODE.CREATED,
            {},
            "Send your message successfully"
          )
        );
    } catch (error) {
      return res
        .status(HTTP_STATUS_CODE.INTERNAL_SERVER_ERROR)
        .json(
          new apiError(error.message, HTTP_STATUS_CODE.INTERNAL_SERVER_ERROR)
        );
    }
  }

  async getContactSupport(req, res) {
    try {
      const contactSupport = await ContactSupport.find({})
        .populate({
          path: "userId",
          select:
            "-password -__v -forgotPasswordToken -forgotPasswordExpiry -fbId",
        })
        .sort({
          createdAt: -1,
        });

      if (!contactSupport) {
        return res
          .status(HTTP_STATUS_CODE.NOT_FOUND)
          .json(
            new apiError(
              "Contact support not found",
              HTTP_STATUS_CODE.NOT_FOUND
            )
          );
      }
      return res
        .status(HTTP_STATUS_CODE.OK)
        .json(
          new apiResponse(
            HTTP_STATUS_CODE.OK,
            contactSupport,
            "Contact support found successfully"
          )
        );
    } catch (error) {
      return res
        .status(HTTP_STATUS_CODE.INTERNAL_SERVER_ERROR)
        .json(
          new apiError(error.message, HTTP_STATUS_CODE.INTERNAL_SERVER_ERROR)
        );
    }
  }
}

module.exports = new ContactSupportController();
