const generateAccessAndRefereshToken = require("../../../config/generateAccessAndRefereshToken ");
const {
  loginValidation,
  forgotsendemailValidation,
  forgotrestpasswordValidation,
} = require("../../../helpers/validation/auth/authValidation");
const User = require("../../../models/userModel");
const apiResponse = require("../../../config/apiResponse");
const apiError = require("../../../config/apiError");
const STATUS_CODES = require("../../../config/httpStatusCodes");
const jwt = require("jsonwebtoken");
const sendEmail = require("../../../helpers/sendEmail");
const crypto = require("crypto");
class RenderAuthController {
  async renderLogin(req, res) {
    try {
      const rememberedEmail = req.cookies.email || "";
      const rememberedPassword = req.cookies.password || "";
      const remember = req.cookies.remember || false;
      return res.render("auth/login", {
        title: "Login",
        rememberedEmail,
        rememberedPassword,
        remember,
        error: req.flash("error"),
        success: req.flash("success"),
      });
    } catch (error) {
      req.flash("error", error.message);
      return res.redirect("/login");
    }
  }

  async login(req, res) {
    try {
      const { email, password, remember } = req.body;

      if (remember) {
        JSON.parse(remember);
      }

      const { error } = loginValidation(req.body);

      if (error) {
        req.flash("error", error.details[0].message);
        return res.redirect("/login");
      }

      const checkUser = await User.findOne({ email: email });

      if (!checkUser) {
        req.flash("error", "Email does not exists");
        return res.redirect("/login");
      }

      if (checkUser.role !== "admin") {
        req.flash("error", "You are not admin");
        return res.redirect("/login");
      }

      if (!checkUser.isVerified) {
        req.flash("error", "Email is not verified");
        return res.redirect("/login");
      }

      const comparePassword = await checkUser.comparePassword(password);

      if (!comparePassword) {
        req.flash("error", "Password is incorrect");
        return res.redirect("/login");
      }

      if (comparePassword) {
        const { accessToken, refreshToken } =
          await generateAccessAndRefereshToken(checkUser._id);

        const isProduction = process.env.NODE_ENV === "production";

        req.flash("success", "You are logged in successfully");

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

        if (remember) {
          return res
            .cookie("accessToken", accessToken, accessOptions)
            .cookie("refreshToken", refreshToken, refreshOptions)
            .cookie("email", email)
            .cookie("password", password)
            .cookie("remember", remember)
            .redirect("/");
        } else {
          return res
            .cookie("accessToken", accessToken, accessOptions)
            .cookie("refreshToken", refreshToken, refreshOptions)
            .clearCookie("email")
            .clearCookie("password")
            .clearCookie("remember")
            .redirect("/");
        }
      }
    } catch (errorMsh) {
      req.flash("error", errorMsh.message);
      res.redirect("/login");
    }
  }

  async logout(req, res) {
    try {
      const options = {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        expires: new Date(0),
      };
      req.flash("success", "You are logged out successfully");
      return res.clearCookie("accessToken", options).redirect("/login");
    } catch (error) {
      req.flash("error", error.message);
      return res.redirect("/");
    }
  }

  async renderSedEmail(req, res) {
    try {
      res.render("auth/send-email", {
        title: "Send Email",
        error: req.flash("error"),
        success: req.flash("success"),
      });
    } catch (error) {
      req.flash("error", error.message);
      return res.redirect("/sendemail");
    }
  }

  async forgotsendemail(req, res) {
    try {
      const { email } = req.body;

      const { error } = forgotsendemailValidation(req.body);

      if (error) {
        req.flash("error", error.details[0].message);
        return res.redirect("/sendemail");
      }

      const checkEmail = await User.findOne({ email: email });
      if (!checkEmail) {
        req.flash("error", "Enter the valid email");
        return res.redirect("/sendemail");
      }

      const generateToken = checkEmail.getResetPasswordToken();
      await checkEmail.save({ validateBeforeSave: false });

      const resetPasswordUrl = `${process.env.CLIENT_URL_ADMIN}/forgotpassword/${generateToken}`;

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
                                        <img src="https://dcassetcdn.com/design_img/3046301/192877/192877_16867651_3046301_7076b9f2_image.jpg" alt="[Your App Name] Logo" style="max-width: 150px;">
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
                                        <a href=${resetPasswordUrl} target="_blank" style="background-color: #007bff; color: #ffffff; text-decoration: none; padding: 15px 25px; border-radius: 5px; font-size: 16px; font-weight: bold; display: inline-block;">
                                            Reset Password
                                        </a>
                                    </td>
                                </tr>
                                <tr>
                                    <td style="color: #666666; font-size: 16px; line-height: 1.6;">
                                        <p>This password reset link is valid for **15 minutes**. After that, it will expire and you will need to request a new one.</p>
                                        <p>If the button above doesn't work, you can copy and paste this URL into your web browser:</p>
                                        <p><a href=${resetPasswordUrl} target="_blank" style="color: #007bff; word-break: break-all;">${resetPasswordUrl}</a></p>
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

      await sendEmail({
        email: checkEmail.email,
        subject: "LMS App Reset Password",
        message: message,
      });

      req.flash("success", "Email sent successfully");
      return res.redirect("/sendemail");
    } catch (errorMsg) {
      req.flash("error", errorMsg.message);
      return res.redirect("/sendemail");
    }
  }

  async renderForegotPassword(req, res) {
    try {
      const { token } = req.params;
      res.render("auth/forgot-password", {
        title: "Forgot Password",
        token,
        error: req.flash("error"),
        success: req.flash("success"),
      });
    } catch (error) {
      req.flash("error", error.message);
      return res.redirect("/forgotpassword/1");
    }
  }

  async forgotrestpassword(req, res) {
    const { token } = req.params;
    try {
      const { password, confirmPassword } = req.body;

      if (!token) {
        req.flash("error", "Token is required");
        return res.redirect(`/forgotpassword/${token}`);
      }

      if (typeof token !== "string") {
        req.flash("error", "Token must be string");
        return res.redirect(`/forgotpassword/${token}`);
      }

      const { error } = forgotrestpasswordValidation(req.body);

      if (error) {
        req.flash("error", error.details[0].message);
        return res.redirect("/forgotpassword");
      }

      if (password !== confirmPassword) {
        req.flash("error", "Password and confirm password must be same");
        return res.redirect(`/forgotpassword/${token}`);
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
        req.flash("error", "Token is invalid or expired");
        return res.redirect(`/forgotpassword/${token}`);
      }

      checkValidation.password = confirmPassword;
      checkValidation.forgotPasswordToken = undefined;
      checkValidation.forgotPasswordExpiry = undefined;

      await checkValidation.save({ validateBeforeSave: false });

      req.flash("success", "Password reset successfully");
      return res.redirect("/login");
    } catch (errorMsg) {
      req.flash("error", errorMsg.message);
      return res.redirect(`/forgotpassword/${token}`);
    }
  }

  async refreshToken(req, res) {
    try {
      const refreshToken = req?.cookies?.refreshToken;

      if (!refreshToken) {
        return res
          .status(STATUS_CODES.UNAUTHORIZED)
          .json(new apiError("Unauthorized", STATUS_CODES.UNAUTHORIZED));
      }

      const decode = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET);

      if (!decode) {
        return res
          .status(STATUS_CODES.UNAUTHORIZED)
          .json(new apiError("Invalid token", STATUS_CODES.UNAUTHORIZED));
      }

      const user = await User.findById(decode.id);

      if (!user) {
        return res
          .status(STATUS_CODES.NOT_FOUND)
          .json(new apiError("User not found", STATUS_CODES.NOT_FOUND));
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
          new apiResponse(
            STATUS_CODES.OK,
            { accessToken: accessToken },
            "Reset token successfully"
          )
        );
    } catch (error) {
      console.error("Refresh token error:", error.message);
      return res
        .status(STATUS_CODES.INTERNAL_SERVER_ERROR)
        .json(new apiError(error.message, STATUS_CODES.INTERNAL_SERVER_ERROR));
    }
  }
}

module.exports = new RenderAuthController();
