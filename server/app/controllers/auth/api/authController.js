const User = require("../../../models/userModel.js");
const Otp = require("../../../models/otpModel.js");
const ApiResponse = require("../../../config/apiResponse");
const ApiError = require("../../../config/apiError");
const sendEmail = require("../../../helpers/sendEmail");
const generateAccessAndRefereshToken = require("../../../config/generateAccessAndRefereshToken ");
const crypto = require("crypto");
const oauth2Client = require("../../../helpers/googleclient");
const jwt = require("jsonwebtoken");
const {
  sendOtpValidation,
  validateOtpValidation,
  registerValidation,
  loginValidation,
  forgotsendemailValidation,
  forgotrestpasswordValidation,
  googleSignUpvalidation,
  googleSignInValidation,
  facebookSignupValidation,
  facebookSignInValidation,
} = require("../../../helpers/validation/auth/authValidation");
const STATUS_CODES = require("../../../config/httpStatusCodes");

class authController {
  async sendOtp(req, res) {
    try {
      const { email } = req.body;

      const { error } = sendOtpValidation(req.body);

      if (error) {
        return res
          .status(STATUS_CODES.BAD_REQUEST)
          .json(
            new ApiError(error.details[0].message, STATUS_CODES.BAD_REQUEST)
          );
      }

      const checkUser = await User.findOne({ email: email });

      if (checkUser) {
        return res
          .status(STATUS_CODES.BAD_REQUEST)
          .json(new ApiError("Email already exists", STATUS_CODES.BAD_REQUEST));
      }

      const checkEmail = await Otp.findOne({ email: email });

      if (checkEmail) {
        await Otp.deleteOne({ email: email });
      }

      const generateOtp = Math.floor(1000 + Math.random() * 9000);

      const createOtp = await Otp.create({
        email: email,
        otp: generateOtp,
        otpExpire: new Date(Date.now() + 2 * 60 * 1000),
      });

      if (!createOtp) {
        return res
          .status(STATUS_CODES.INTERNAL_SERVER_ERROR)
          .json(
            new ApiError(
              "Failed to send otp",
              STATUS_CODES.INTERNAL_SERVER_ERROR
            )
          );
      }

      const mailOption = {
        email: createOtp.email,
        subject: "OTP for email verification",
        message: `<!DOCTYPE html>
<html>
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>OTP Verification</title>
  </head>
  <body
    style="
      font-family: Arial, sans-serif;
      background-color: #f4f4f4;
      margin: 0;
      padding: 0;
    "
  >
    <table
      role="presentation"
      width="100%"
      cellspacing="0"
      cellpadding="0"
      border="0"
      style="background-color: #f4f4f4"
    >
      <tr>
        <td align="center" style="padding: 20px">
          <table
            role="presentation"
            width="600"
            cellspacing="0"
            cellpadding="0"
            border="0"
            style="
              background-color: #ffffff;
              border-radius: 8px;
              box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
            "
          >
            <tr>
              <td style="padding: 30px">
                <table width="100%" cellspacing="0" cellpadding="0" border="0">
                  <tr>
                    <td align="center" style="padding-bottom: 20px">
                      <img
                        src="https://dcassetcdn.com/design_img/3046301/192877/192877_16867651_3046301_7076b9f2_image.jpg"
                        alt="[Your App Name] Logo"
                        style="max-width: 150px"
                      />
                    </td>
                  </tr>
                  <tr>
                    <td align="center">
                      <h1 style="color: #333333; margin: 0; font-size: 24px">
                        One-Time otp (OTP)
                      </h1>
                    </td>
                  </tr>
                </table>

                <table
                  width="100%"
                  cellspacing="0"
                  cellpadding="0"
                  border="0"
                  style="margin-top: 20px"
                >
                  <tr>
                    <td
                      style="color: #666666; font-size: 16px; line-height: 1.6"
                    >
                      <p>Hello,</p>
                      <p>
                        You are two step away from completing your [
                        registration]. Use the following One-Time otp to verify
                        your identity.
                      </p>
                    </td>
                  </tr>
                  <tr>
                    <td align="center" style="padding: 20px 0">
                      <div
                        style="
                          background-color: #f0f0f0;
                          border: 1px solid #e0e0e0;
                          border-radius: 4px;
                          display: inline-block;
                          padding: 15px 30px;
                        "
                      >
                        <h2
                          style="
                            color: #007bff;
                            margin: 0;
                            font-size: 32px;
                            letter-spacing: 5px;
                          "
                        >
                          ${createOtp.otp}
                        </h2>
                      </div>
                    </td>
                  </tr>
                  <tr>
                    <td
                      style="color: #666666; font-size: 16px; line-height: 1.6"
                    >
                      <p>
                        This code is valid for
                        <strong>2</strong> minutes. Please enter it on the
                        verification screen to proceed.
                      </p>
                    </td>
                  </tr>
                  <tr>
                    <td style="padding-top: 20px">
                      <hr style="border: none; border-top: 1px solid #dddddd" />
                      <p
                        style="
                          color: #888888;
                          font-size: 14px;
                          margin-top: 20px;
                        "
                      >
                        <strong>Security Notice:</strong> Do not share this code
                        with anyone. We will never ask you for your password or
                        this code in an email or phone call. If you did not
                        request this, please ignore this email.
                      </p>
                    </td>
                  </tr>
                </table>
              </td>
            </tr>
          </table>

          <table
            role="presentation"
            width="600"
            cellspacing="0"
            cellpadding="0"
            border="0"
            style="margin-top: 20px"
          >
            <tr>
              <td
                align="center"
                style="color: #999999; font-size: 12px; line-height: 1.5"
              >
                <p>&copy; 2025 LMS APP. All rights reserved.</p>
                <p>123 Main Street, Anytown, USA 12345</p>
              </td>
            </tr>
          </table>
        </td>
      </tr>
    </table>
  </body>
</html>
`,
      };

      try {
        await sendEmail(mailOption);
        createOtp.isotpsend = true;
        await createOtp.save({ validateBeforeSave: false });
        return res
          .status(STATUS_CODES.CREATED)
          .json(
            new ApiResponse(STATUS_CODES.CREATED, {}, "Otp sent successfully")
          );
      } catch (error) {
        createOtp.isotpsend = false;
        await createOtp.save({ validateBeforeSave: false });
        return res
          .status(STATUS_CODES.INTERNAL_SERVER_ERROR)
          .json(
            new ApiError(error.message, STATUS_CODES.INTERNAL_SERVER_ERROR)
          );
      }
    } catch (error) {
      return res
        .status(STATUS_CODES.INTERNAL_SERVER_ERROR)
        .json(new ApiError(error.message, STATUS_CODES.INTERNAL_SERVER_ERROR));
    }
  }

  async verifyOtp(req, res) {
    try {
      const { email, otp } = req.body;

      const { error } = validateOtpValidation(req.body);

      if (error) {
        return res
          .status(STATUS_CODES.BAD_REQUEST)
          .json(
            new ApiError(error.details[0].message, STATUS_CODES.BAD_REQUEST)
          );
      }

      const findOtp = await Otp.findOne({ email: email });

      if (!findOtp.isotpsend) {
        return res
          .status(STATUS_CODES.BAD_REQUEST)
          .json(new ApiError("Otp not sent", STATUS_CODES.BAD_REQUEST));
      }

      if (findOtp.otp !== Number(otp)) {
        return res
          .status(STATUS_CODES.BAD_REQUEST)
          .json(new ApiError("Invalid otp", STATUS_CODES.BAD_REQUEST));
      }

      if (findOtp.otpExpire < Date.now()) {
        return res
          .status(STATUS_CODES.BAD_REQUEST)
          .json(new ApiError("Otp expired", STATUS_CODES.BAD_REQUEST));
      }

      findOtp.isotpsend = false;
      findOtp.otpVerified = true;
      await findOtp.save({ validateBeforeSave: false });

      return res
        .status(STATUS_CODES.OK)
        .json(new ApiResponse(STATUS_CODES.OK, {}, "Otp verified"));
    } catch (error) {
      return res
        .status(STATUS_CODES.INTERNAL_SERVER_ERROR)
        .json(new ApiError(error.message, STATUS_CODES.INTERNAL_SERVER_ERROR));
    }
  }

  async register(req, res) {
    try {
      const { email, fullName, password } = req.body;

      const { error } = registerValidation(req.body);

      if (error) {
        return res
          .status(STATUS_CODES.BAD_REQUEST)
          .json(
            new ApiError(error.details[0].message, STATUS_CODES.BAD_REQUEST)
          );
      }

      const verifyEmail = await Otp.findOne({ email: email });

      if (!verifyEmail) {
        return res
          .status(STATUS_CODES.BAD_REQUEST)
          .json(
            new ApiError("Enter the verified email", STATUS_CODES.BAD_REQUEST)
          );
      }

      if (!verifyEmail.otpVerified) {
        return res
          .status(STATUS_CODES.NOT_FOUND)
          .json(new ApiError("Otp not verified", STATUS_CODES.NOT_FOUND));
      }

      const checkEmail = await User.findOne({ email: email });
      if (checkEmail) {
        return res
          .status(STATUS_CODES.BAD_REQUEST)
          .json(new ApiError("Email already exists", STATUS_CODES.BAD_REQUEST));
      }

      const createUser = await User.create({
        email,
        fullName,
        password,
        isVerified: true,
      });

      if (!createUser) {
        return res
          .status(500)
          .json(new ApiError("Failed to register user", 500));
      }
      await Otp.deleteOne({ email: email });
      return res
        .status(STATUS_CODES.CREATED)
        .json(
          new ApiResponse(
            STATUS_CODES.CREATED,
            {},
            "User register successfully"
          )
        );
    } catch (error) {
      return res
        .status(STATUS_CODES.INTERNAL_SERVER_ERROR)
        .json(new ApiError(error.message, STATUS_CODES.INTERNAL_SERVER_ERROR));
    }
  }

  async login(req, res) {
    try {
      const { email, password } = req.body;

      const { error } = loginValidation(req.body);

      if (error) {
        return res
          .status(STATUS_CODES.BAD_REQUEST)
          .json(
            new ApiError(error.details[0].message, STATUS_CODES.BAD_REQUEST)
          );
      }

      const checkUser = await User.findOne({ email: email });
      if (!checkUser) {
        return res
          .status(STATUS_CODES.NOT_FOUND)
          .json(new ApiError("Email does not exists", STATUS_CODES.NOT_FOUND));
      }

      if (!checkUser.isVerified) {
        return res
          .status(STATUS_CODES.BAD_REQUEST)
          .json(
            new ApiError("Email is not verified", STATUS_CODES.BAD_REQUEST)
          );
      }

      if (checkUser.role === "admin") {
        return res
          .status(STATUS_CODES.BAD_REQUEST)
          .json(new ApiError("Admin can not login", STATUS_CODES.BAD_REQUEST));
      }

      if (checkUser.isDeleted) {
        return res
          .status(STATUS_CODES.BAD_REQUEST)
          .json(new ApiError("User is deleted", STATUS_CODES.BAD_REQUEST));
      }

      const comparePassword = await checkUser.comparePassword(password);

      if (!comparePassword) {
        return res
          .status(STATUS_CODES.BAD_REQUEST)
          .json(
            new ApiError("Password is incorrect", STATUS_CODES.BAD_REQUEST)
          );
      }

      if (comparePassword) {
        const { accessToken, refreshToken } =
          await generateAccessAndRefereshToken(checkUser._id);

        const isProduction = process.env.NODE_ENV === "production";
        const accessOptions = {
          httpOnly: true,
          secure: isProduction,
          sameSite: isProduction ? "none" : "lax",
          partitioned: isProduction,
          expires: new Date(Date.now() + 15 * 60 * 1000),
          path: "/",
        };

        const refreshOptions = {
          httpOnly: true,
          secure: isProduction,
          sameSite: isProduction ? "none" : "lax",
          partitioned: isProduction,
          expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
          path: "/",
        };

        return res
          .status(STATUS_CODES.OK)
          .cookie("accessToken", accessToken, accessOptions)
          .cookie("refreshToken", refreshToken, refreshOptions)
          .json(
            new ApiResponse(
              STATUS_CODES.OK,
              { accessToken: accessToken, refreshToken: refreshToken },
              "User login successfully"
            )
          );
      }
    } catch (error) {
      return res
        .status(STATUS_CODES.INTERNAL_SERVER_ERROR)
        .json(new ApiError(error.message, STATUS_CODES.INTERNAL_SERVER_ERROR));
    }
  }

  async logout(req, res) {
    try {
      const options = {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        expires: new Date(0),
      };
      return res
        .status(200)
        .clearCookie("accessToken", options)
        .clearCookie("refreshToken", options)
        .json(new ApiResponse(200, {}, "User logout successfully"));
    } catch (error) {
      return res.status(500).json(new ApiError(error.message, 500));
    }
  }

  async forgotsendemail(req, res) {
    try {
      const { email } = req.body;

      const { error } = forgotsendemailValidation(req.body);

      if (error) {
        return res
          .status(STATUS_CODES.BAD_REQUEST)
          .json(
            new ApiError(error.details[0].message, STATUS_CODES.BAD_REQUEST)
          );
      }

      const checkEmail = await User.findOne({ email: email });
      if (!checkEmail) {
        return res
          .status(STATUS_CODES.BAD_REQUEST)
          .json(
            new ApiError("Enter the valid email", STATUS_CODES.BAD_REQUEST)
          );
      }

      const generateToken = checkEmail.getResetPasswordToken();
      await checkEmail.save({ validateBeforeSave: false });

      const resetPasswordUrl = `${process.env.CLIENT_URL}/forgot-reset-password/${generateToken}`;

      const message = `<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Password Reset</title>
</head>
<body style="font-family: Arial, sans-serif; background-color: #f4f4f4; margin: 0; padding: 0;">

    <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="background-color: #f4f4f4;">
        <tr>
            <td align="center" style="padding: 20px;">
                <table role="presentation" width="600" cellspacing="0" cellpadding="0" border="0" style="background-color: #ffffff; border-radius: 8px; box-shadow: 0 4px 6px rgba(0,0,0,0.1);">
                    <tr>
                        <td style="padding: 30px;">
                            <table width="100%" cellspacing="0" cellpadding="0" border="0">
                                <tr>
                                    <td align="center" style="padding-bottom: 20px;">
                                        <img src="https://dcassetcdn.com/design_img/3046301/192877/192877_16867651_3046301_7076b9f2_image.jpg" alt="[LMS ACADEMY]" style="max-width: 150px;">
                                    </td>
                                </tr>
                                <tr>
                                    <td align="center">
                                        <h1 style="color: #333333; margin: 0; font-size: 24px;">Password Reset</h1>
                                    </td>
                                </tr>
                            </table>

                            <table width="100%" cellspacing="0" cellpadding="0" border="0" style="margin-top: 20px;">
                                <tr>
                                    <td style="color: #666666; font-size: 16px; line-height: 1.6;">
                                        <p>Hello ${checkEmail.fullName},</p>
                                        <p>We received a request to reset the password for your account associated with this email address. If you made this request, click the button below to set a new password.</p>
                                    </td>
                                </tr>
                                <tr>
                                    <td align="center" style="padding: 30px 0;">
                                        <a href="${resetPasswordUrl}" target="_blank" style="background-color: #007bff; color: #ffffff; text-decoration: none; padding: 15px 25px; border-radius: 5px; font-size: 16px; font-weight: bold; display: inline-block;">
                                            Reset Password
                                        </a>
                                    </td>
                                </tr>
                                <tr>
                                    <td style="color: #666666; font-size: 16px; line-height: 1.6;">
                                        <p>This password reset link is valid for **15 minutes**. After that, it will expire and you will need to request a new one.</p>
                                        <p>If the button above doesn't work, you can copy and paste this URL into your web browser:</p>
                                        <p><a href="${resetPasswordUrl}" target="_blank" style="color: #007bff; word-break: break-all;">${resetPasswordUrl}</a></p>
                                    </td>
                                </tr>
                                <tr>
                                    <td style="padding-top: 20px;">
                                        <hr style="border: none; border-top: 1px solid #dddddd;">
                                        <p style="color: #888888; font-size: 14px; margin-top: 20px;">
                                            <strong>Didn't request this?</strong> If you did not request a password reset, please ignore this email. Your password is safe and will not be changed.
                                        </p>
                                    </td>
                                </tr>
                            </table>
                        </td>
                    </tr>
                </table>

                <table role="presentation" width="600" cellspacing="0" cellpadding="0" border="0" style="margin-top: 20px;">
                    <tr>
                        <td align="center" style="color: #999999; font-size: 12px; line-height: 1.5;">
                            <p>&copy; 2025 LMS APP. All rights reserved.</p>
                            <p>[Your Company Address, e.g., 123 Main Street, Anytown, USA 12345]</p>
                        </td>
                    </tr>
                </table>
            </td>
        </tr>
    </table>

</body>
</html>`;

      try {
        await sendEmail({
          email: checkEmail.email,
          subject: "LMS App Reset Password",
          message: message,
        });

        return res
          .status(STATUS_CODES.OK)
          .json(
            new ApiResponse(STATUS_CODES.OK, {}, "Email sent successfully")
          );
      } catch (error) {
        checkEmail.forgotPasswordToken = undefined;
        checkEmail.forgotPasswordExpiry = undefined;
        await checkEmail.save({ validateBeforeSave: false });
        return res
          .status(STATUS_CODES.INTERNAL_SERVER_ERROR)
          .json(
            new ApiError(error.message, STATUS_CODES.INTERNAL_SERVER_ERROR)
          );
      }
    } catch (error) {
      return res
        .status(STATUS_CODES.INTERNAL_SERVER_ERROR)
        .json(new ApiError(error.message, STATUS_CODES.INTERNAL_SERVER_ERROR));
    }
  }

  async forgotrestpassword(req, res) {
    try {
      const { password, confirmPassword } = req.body;
      const { token } = req.params;

      if (!token) {
        return res
          .status(STATUS_CODES.BAD_REQUEST)
          .json(new ApiError("Token is required", STATUS_CODES.BAD_REQUEST));
      }

      if (typeof token !== "string") {
        return res
          .status(STATUS_CODES.BAD_REQUEST)
          .json(new ApiError("Token must be string", STATUS_CODES.BAD_REQUEST));
      }

      const { error } = forgotrestpasswordValidation(req.body);

      if (error) {
        return res
          .status(STATUS_CODES.BAD_REQUEST)
          .json(
            new ApiError(error.details[0].message, STATUS_CODES.BAD_REQUEST)
          );
      }

      if (password !== confirmPassword) {
        return res
          .status(STATUS_CODES.BAD_REQUEST)
          .json(
            new ApiError(
              "Password and confirm password is not same",
              STATUS_CODES.BAD_REQUEST
            )
          );
      }

      const resetPasswordToken = crypto
        .createHash("sha256")
        .update(token)
        .digest("hex");

      const checkValidation = await User.findOne({
        forgotPasswordToken: resetPasswordToken,
        forgotPasswordExpiry: { $gt: Date.now() },
      });

      if (!checkValidation) {
        return res
          .status(STATUS_CODES.BAD_REQUEST)
          .json(new ApiError("Token is invalid", STATUS_CODES.BAD_REQUEST));
      }

      checkValidation.password = confirmPassword;
      checkValidation.forgotPasswordToken = undefined;
      checkValidation.forgotPasswordExpiry = undefined;

      await checkValidation.save({ validateBeforeSave: false });

      return res
        .status(STATUS_CODES.OK)
        .json(
          new ApiResponse(STATUS_CODES.OK, {}, "Password reset successfully")
        );
    } catch (error) {
      return res
        .status(STATUS_CODES.INTERNAL_SERVER_ERROR)
        .json(new ApiError(error.message, STATUS_CODES.INTERNAL_SERVER_ERROR));
    }
  }

  async googlesignup(req, res) {
    try {
      const { code } = req.query;

      const { error } = googleSignUpvalidation(req.query);

      if (error) {
        return res
          .status(STATUS_CODES.BAD_REQUEST)
          .json(
            new ApiError(error.details[0].message, STATUS_CODES.BAD_REQUEST)
          );
      }

      const googleRes = await oauth2Client.getToken(code);

      if (!googleRes) {
        return res
          .status(STATUS_CODES.BAD_REQUEST)
          .json(new ApiError("Invalid token", STATUS_CODES.BAD_REQUEST));
      }
      oauth2Client.setCredentials(googleRes.tokens);

      const response = await fetch(
        `https://www.googleapis.com/oauth2/v1/userinfo?alt=json&access_token=${googleRes.tokens.access_token}`
      );
      const data = await response.json();

      const checkEmail = await User.findOne({ email: data.email });

      if (checkEmail) {
        return res
          .status(STATUS_CODES.BAD_REQUEST)
          .json(
            new ApiError("Email is already exist", STATUS_CODES.BAD_REQUEST)
          );
      }

      const createuser = await User.create({
        fullName: data?.name,
        email: data?.email,
        password: data?.id,
        gooleavatar: data?.picture,
        isVerified: true,
      });

      if (!createuser) {
        return res
          .status(STATUS_CODES.INTERNAL_SERVER_ERROR)
          .json(
            new ApiError("User not created", STATUS_CODES.INTERNAL_SERVER_ERROR)
          );
      }

      const { accessToken, refreshToken } =
        await generateAccessAndRefereshToken(createuser._id);

      const isProduction = process.env.NODE_ENV === "production";
      const accessOptions = {
        httpOnly: true,
        secure: isProduction,
        sameSite: isProduction ? "none" : "lax",
        partitioned: isProduction,
        expires: new Date(Date.now() + 15 * 60 * 1000),
        path: "/",
      };

      const refreshOptions = {
        httpOnly: true,
        secure: isProduction,
        sameSite: isProduction ? "none" : "lax",
        partitioned: isProduction,
        expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
        path: "/",
      };

      return res
        .status(STATUS_CODES.CREATED)
        .cookie("accessToken", accessToken, accessOptions)
        .cookie("refreshToken", refreshToken, refreshOptions)
        .json(
          new ApiResponse(
            STATUS_CODES.CREATED,
            { accessToken: accessToken, refreshToken: refreshToken },
            "User signup successfully"
          )
        );
    } catch (error) {
      return res
        .status(STATUS_CODES.INTERNAL_SERVER_ERROR)
        .json(new ApiError(error.message, STATUS_CODES.INTERNAL_SERVER_ERROR));
    }
  }

  async googlesignin(req, res) {
    try {
      const { code } = req.query;

      const { error } = googleSignInValidation(req.query);

      if (error) {
        return res
          .status(STATUS_CODES.BAD_REQUEST)
          .json(
            new ApiError(error.details[0].message, STATUS_CODES.BAD_REQUEST)
          );
      }

      const googleRes = await oauth2Client.getToken(code);

      if (!googleRes) {
        return res
          .status(STATUS_CODES.BAD_REQUEST)
          .json(new ApiError("Invalid token", STATUS_CODES.BAD_REQUEST));
      }
      oauth2Client.setCredentials(googleRes.tokens);

      const response = await fetch(
        `https://www.googleapis.com/oauth2/v1/userinfo?alt=json&access_token=${googleRes.tokens.access_token}`
      );
      const data = await response.json();

      const checkEmail = await User.findOne({ email: data.email });

      if (!checkEmail) {
        return res
          .status(STATUS_CODES.BAD_REQUEST)
          .json(
            new ApiError(
              "User not found with this email",
              STATUS_CODES.BAD_REQUEST
            )
          );
      }

      const comparePassword = await checkEmail.comparePassword(data?.id);

      if (!comparePassword) {
        return res
          .status(STATUS_CODES.BAD_REQUEST)
          .json(
            new ApiError("Password is incorrect", STATUS_CODES.BAD_REQUEST)
          );
      }

      if (comparePassword) {
        const { accessToken, refreshToken } =
          await generateAccessAndRefereshToken(checkEmail._id);

        const isProduction = process.env.NODE_ENV === "production";
        const accessOptions = {
          httpOnly: true,
          secure: isProduction,
          sameSite: isProduction ? "none" : "lax",
          partitioned: isProduction,
          expires: new Date(Date.now() + 15 * 60 * 1000),
          path: "/",
        };

        const refreshOptions = {
          httpOnly: true,
          secure: isProduction,
          sameSite: isProduction ? "none" : "lax",
          partitioned: isProduction,
          expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
          path: "/",
        };

        return res
          .status(STATUS_CODES.OK)
          .cookie("accessToken", accessToken, accessOptions)
          .cookie("refreshToken", refreshToken, refreshOptions)
          .json(
            new ApiResponse(
              STATUS_CODES.OK,
              { accessToken: accessToken, refreshToken: refreshToken },
              "User login successfully"
            )
          );
      }
    } catch (error) {
      return res
        .status(STATUS_CODES.INTERNAL_SERVER_ERROR)
        .json(new ApiError(error.message, STATUS_CODES.INTERNAL_SERVER_ERROR));
    }
  }

  async facebookSignup(req, res) {
    try {
      const { name, email, id, avatar } = req.body;

      const { error } = facebookSignupValidation(req.body);

      if (error) {
        return res
          .status(STATUS_CODES.BAD_REQUEST)
          .json(
            new ApiError(error.details[0].message, STATUS_CODES.BAD_REQUEST)
          );
      }

      const checkIsSignUp = await User.findOne({ fbId: id });

      const checkEmail = await User.findOne({ email: email });

      if (checkIsSignUp) {
        return res
          .status(STATUS_CODES.BAD_REQUEST)
          .json(new ApiError("User already exists", STATUS_CODES.BAD_REQUEST));
      }

      if (checkEmail) {
        return res
          .status(STATUS_CODES.BAD_REQUEST)
          .json(
            new ApiError(
              "Change your facebook varified email",
              STATUS_CODES.BAD_REQUEST
            )
          );
      }

      const createUser = await User.create({
        fbId: id,
        fullName: name,
        email: email,
        password: id,
        faceBookavatar: avatar,
        isVerified: true,
      });

      if (!createUser) {
        return res
          .status(STATUS_CODES.INTERNAL_SERVER_ERROR)
          .json(
            new ApiError(
              "Failed to create user",
              STATUS_CODES.INTERNAL_SERVER_ERROR
            )
          );
      }

      const { accessToken, refreshToken } =
        await generateAccessAndRefereshToken(createUser._id);

      const isProduction = process.env.NODE_ENV === "production";
      const accessOptions = {
        httpOnly: true,
        secure: isProduction,
        sameSite: isProduction ? "none" : "lax",
        partitioned: isProduction,
        expires: new Date(Date.now() + 15 * 60 * 1000),
        path: "/",
      };

      const refreshOptions = {
        httpOnly: true,
        secure: isProduction,
        sameSite: isProduction ? "none" : "lax",
        partitioned: isProduction,
        expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
        path: "/",
      };

      return res
        .status(STATUS_CODES.CREATED)
        .cookie("accessToken", accessToken, accessOptions)
        .cookie("refreshToken", refreshToken, refreshOptions)
        .json(
          new ApiResponse(
            STATUS_CODES.CREATED,
            { accessToken: accessToken, refreshToken: refreshToken },
            "User signup successfully"
          )
        );
    } catch (error) {
      return res
        .status(STATUS_CODES.INTERNAL_SERVER_ERROR)
        .json(new ApiError(error.message, STATUS_CODES.INTERNAL_SERVER_ERROR));
    }
  }

  async facebookSignin(req, res) {
    try {
      const { id } = req.body;

      const { error } = facebookSignInValidation(req.body);

      if (error) {
        return res
          .status(STATUS_CODES.BAD_REQUEST)
          .json(
            new ApiError(error.details[0].message, STATUS_CODES.BAD_REQUEST)
          );
      }

      const checkIsSignIn = await User.findOne({ fbId: id });

      if (!checkIsSignIn) {
        return res
          .status(STATUS_CODES.BAD_REQUEST)
          .json(
            new ApiError(
              "User not found with this facebook id",
              STATUS_CODES.BAD_REQUEST
            )
          );
      }

      const comparePassword = await checkIsSignIn.comparePassword(id);

      if (!comparePassword) {
        return res
          .status(STATUS_CODES.BAD_REQUEST)
          .json(
            new ApiError("Password is incorrect", STATUS_CODES.BAD_REQUEST)
          );
      }

      const { accessToken, refreshToken } =
        await generateAccessAndRefereshToken(checkIsSignIn._id);

      const isProduction = process.env.NODE_ENV === "production";
      const accessOptions = {
        httpOnly: true,
        secure: isProduction,
        sameSite: isProduction ? "none" : "lax",
        partitioned: isProduction,
        expires: new Date(Date.now() + 15 * 60 * 1000),
        path: "/",
      };

      const refreshOptions = {
        httpOnly: true,
        secure: isProduction,
        sameSite: isProduction ? "none" : "lax",
        partitioned: isProduction,
        expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
        path: "/",
      };

      return res
        .status(STATUS_CODES.CREATED)
        .cookie("accessToken", accessToken, accessOptions)
        .cookie("refreshToken", refreshToken, refreshOptions)
        .json(
          new ApiResponse(
            STATUS_CODES.CREATED,
            { accessToken: accessToken, refreshToken: refreshToken },
            "User signup successfully"
          )
        );
    } catch (error) {
      return res
        .status(STATUS_CODES.INTERNAL_SERVER_ERROR)
        .json(new ApiError(error.message, STATUS_CODES.INTERNAL_SERVER_ERROR));
    }
  }

  async refresToken(req, res) {
    try {
      const refreshToken = req?.cookies?.refreshToken;

      if (!refreshToken) {
        return res
          .status(STATUS_CODES.UNAUTHORIZED)
          .json(new ApiError("Unauthorized", STATUS_CODES.UNAUTHORIZED));
      }

      const decode = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET);

      if (!decode) {
        return res
          .status(STATUS_CODES.UNAUTHORIZED)
          .json(new ApiError("Invalid token", STATUS_CODES.UNAUTHORIZED));
      }

      const user = await User.findById(decode.id);

      if (!user) {
        return res
          .status(STATUS_CODES.NOT_FOUND)
          .json(new ApiError("User not found", STATUS_CODES.NOT_FOUND));
      }

      const { accessToken } = await generateAccessAndRefereshToken(user._id);

      const isProduction = process.env.NODE_ENV === "production";
      const accessOptions = {
        httpOnly: true,
        secure: isProduction,
        sameSite: isProduction ? "none" : "lax",
        partitioned: isProduction,
        expires: new Date(Date.now() + 15 * 60 * 1000),
        path: "/",
      };
      return res
        .status(STATUS_CODES.OK)
        .cookie("accessToken", accessToken, accessOptions)
        .json(
          new ApiResponse(
            STATUS_CODES.OK,
            { accessToken: accessToken },
            "Reset token successfully"
          )
        );
    } catch (error) {
      return res
        .status(STATUS_CODES.INTERNAL_SERVER_ERROR)
        .json(new ApiError(error.message, STATUS_CODES.INTERNAL_SERVER_ERROR));
    }
  }
}

module.exports = new authController();
