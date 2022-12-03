const User = require("../Model/User");
const AppError = require("../AppError");
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
      const userData = await user.save();
      const userToken = await user.getSignedJwtToken();
      return res.status(200).send({ userData, userToken });
    } catch (err) {
      next(err);
    }
  };
}
module.exports = new UserController();
