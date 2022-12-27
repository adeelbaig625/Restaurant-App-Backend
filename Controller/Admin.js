const Admin = require("../Model/Admin");
const AppError = require("../utils/AppError");
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
  update = async (req, res, next) => {
    try {
      let obj = req.body;
      delete obj.password;
      const updateAdmin = await Admin.findByIdAndUpdate(req.user._id, obj, {
        new: true,
      });
      return res.status(200).json({ success: true, updateAdmin });
    } catch (err) {
      next(err);
    }
  };

  updatePassword = async (req, res, next) => {
    try {
      const { oldPassword, newPassword } = req.body;
      const admin = await Admin.findById(req.user._id).select("+password");
      if (!(await admin.matchPassword(oldPassword))) {
        next(AppError.unauthorized("Invalid credentials"));
      }
      admin.password = newPassword;
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

  UpdateProduct = async (req, res, next) => {
    try {
      let obj = req.body;
      if (Object.keys(obj).length === 0) {
        return next(AppError.badRequest("Please provide data to update"));
      }
      const updateProduct = await Product.findByIdAndUpdate(
        req.params.id,
        obj,
        { new: true, upsert: true }
      );
      return res.status(200).json({ success: true, updateProduct });
    } catch (err) {
      return next(err);
    }
  };
}
module.exports = new AdminController();
