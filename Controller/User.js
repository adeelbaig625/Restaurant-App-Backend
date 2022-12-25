const User = require("../Model/User");
const AppError = require("../AppError");
const { sendEmail } = require("../utils/sendEmail");
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
  // sendResestPasswordEmail = async (req, res, next) => {
  //   try {
  //     const { email } = req.body;
  //     const user = await User.findOne({ email });
  //     if (!user) {
  //       return next(AppError.notFound("User not found"));
  //     }
  //     const resetToken = await user.getResetPasswordToken();
  //     await user.save();
  //     const resetUrl = `${req.protocol}://${req.get(
  //       "host"
  //     )}/api/user/resetpassword/${resetToken}`;
  //     const message = `You are receiving this email because you (or someone else) has requested the reset of a password. Please make a PUT request to: \n\n ${resetUrl}`;
  //     try {
  //       await sendEmail({
  //         email: user.email,
  //         subject: "Password reset token",
  //         message,
  //       });
  //       res.status(200).json({ success: true, data: "Email sent" });
  //     } catch (err) {
  //       console.log(err);
  //       user.resetPasswordToken = undefined;
  //       user.resetPasswordExpire = undefined;
  //       await user.save();
  //       return next(AppError.serverError("Email could not be sent"));
  //     }
  //   } catch (err) {
  //     next(err);
  //   }
  // };
}
module.exports = new UserController();
