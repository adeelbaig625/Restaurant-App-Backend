const User = require("../Model/User");
const AppError = require("../AppError");
const { sendEmail } = require("../utils/sendEmail");
const crypto = require("crypto");
const Token = require("../Model/Token");
class UserController {
  signup = async (req, res, next) => {
    try {
      const { name, email, password } = req.body;
      const user = new User({
        name,
        email,
        password,
      });
      const validateError = user.validateSync();
      if (validateError) {
        next(AppError.badRequest(validateError.message));
      }
      await user.save();
      return res.status(200).json({ success: true });
    } catch (err) {
      next(err);
    }
  };
  login = async (req, res, next) => {
    try {
      const { email, password } = req.body;
      if (!email || !password) {
        next(AppError.badRequest("Please provide email and password"));
      }
      const user = await User.findOne({ email }).select("+password");
      if (!user) {
        next(AppError.unauthorized("Invalid credentials"));
      }
      const isMatch = await user.matchPassword(password);
      if (!isMatch) {
        next(AppError.unauthorized("Invalid credentials"));
      }
      const userToken = await user.getSignedJwtToken();
      user.password = undefined;
      return res.status(200).send({ user, userToken });
    } catch (err) {
      next(err);
    }
  };
  updatePassword = async (req, res, next) => {
    try {
      const { oldPassword, newPassword } = req.body;
      const user = await User.findById(req.user._id).select("+password");
      if (!(await user.matchPassword(oldPassword))) {
        return next(AppError.unauthorized("Invalid credentials"));
      }
      user.password = newPassword;
      await user.save();
      return res.status(200).json({ success: true });
    } catch (err) {
      next(err);
    }
  };
  profile = async (req, res, next) => {
    try {
      return res.status(200).send(req.user);
    } catch (err) {
      next(err);
    }
  };
  sendEmail = async (req, res, next) => {
    try {
      const send = await sendEmail("adeelbaig625@gmail.com", "dasda", "dasdda");
      return res.status(200).send("Email sent");
    } catch (err) {
      next(err);
    }
  };
  sendResetPasswordEmail = async (req, res, next) => {
    try {
      const { email } = req.body;
      console.log(email);
      const user = await User.findOne({ email });
      if (!user) {
        return next(AppError.unauthorized("User not found"));
      }
      let token = await Token.findOne({ user: user._id });

      if (!token) {
        token = await new Token({
          user: user._id,
          token: crypto.randomBytes(32).toString("hex"),
        }).save();
      }
      const link = `${process.env.BASE_URL}/resetpassword/${user._id}/${token.token}`;
      const message = `You are receiving this email because you (or someone else) has requested the reset of a password. Please make a PUT request to: \n\n ${link}`;
      try {
        await sendEmail(email, "Password reset token", message);
        res.status(200).json({ success: true, data: "Email sent" });
      } catch (err) {
        console.log(err);
        user.resetPasswordToken = undefined;
        user.resetPasswordExpire = undefined;
        await user.save();
        return next(AppError.serverError("Email could not be sent"));
      }
    } catch (err) {
      next(err);
    }
  };
  resetPassword = async (req, res, next) => {
    try {
      const { password } = req.body;
      const { userId, token } = req.params;
      const user = await User.findById(userId);
      if (!user) {
        return next(AppError.unauthorized("User not found"));
      }
      console.log(userId, token);
      const resetToken = await Token.findOne({ token });
      if (!resetToken) {
        return next(AppError.unauthorized("Token not found"));
      }
      user.password = password;
      await user.save();
      await resetToken.remove();
      return res.status(200).json({ success: true, data: "Password reset" });
    } catch (err) {
      next(err);
    }
  };
}
module.exports = new UserController();
