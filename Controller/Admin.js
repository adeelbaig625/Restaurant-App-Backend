const Admin = require("../Model/Admin");
const AppError = require("../AppError");
const Product = require("../Model/Product");
class AdminController {
  signup = async (req, res, next) => {
    try {
      const { name, email, password } = req.body;
      const admin = new Admin({
        name,
        email,
        password,
      });
      const validateError = admin.validateSync();
      if (validateError) {
        next(AppError.badRequest(validateError.message));
      }
      await admin.save();
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
      const admin = await Admin.findOne({ email }).select("+password");
      if (!admin) {
        next(AppError.unauthorized("Invalid credentials"));
      }
      const isMatch = await admin.matchPassword(password);
      if (!isMatch) {
        next(AppError.unauthorized("Invalid credentials"));
      }
      const adminToken = await admin.getSignedJwtToken(true);
      admin.password = undefined;
      return res.status(200).send({ admin, adminToken });
    } catch (err) {
      next(err);
    }
  };
  profile = async (req, res, next) => {
    try {
      console.log(req.user);
      return res.status(200).send(req.user);
    } catch (err) {
      next(err);
    }
  };
  AddProduct = async (req, res, next) => {
    try {
      const { name, price, description, image } = req.body;
      const product = new Product({
        name,
        price,
        description,
        image,
      });
      const validateError = product.validateSync();
      if (validateError) {
        next(AppError.badRequest(validateError.message));
      }
      await product.save();
      return res.status(200).json({ success: true });
    } catch (err) {
      next(err);
    }
  };
}
module.exports = new AdminController();
