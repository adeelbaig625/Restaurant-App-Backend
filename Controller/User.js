const User = require("../Model/User");
class UserController {
  signup = async (req, res, next) => {
    try {
      const { name, email, password } = req.body;
      const user = new User({
        name,
        email,
        password,
      });
      const err = user.validateSync();
      if (err) {
        res.status(400);
        next(err);
      }
      const userData = await user.save();
      const userToken = await user.getSignedJwtToken();
      return res.status(200).send({ userData, userToken });
    } catch (err) {
      return res.status(500).send({ err: err?.message });
    }
  };
}
module.exports = new UserController();
