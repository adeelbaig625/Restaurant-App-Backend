const Order = require("../Model/Order");
const AppError = require("../AppError");
const Cart = require("../Model/Cart");
const Product = require("../Model/Product");
const User = require("../Model/User");
class OrderController {
  addOrderToUser = async (req, res, next) => {
    const { cartId } = req.body;
    try {
      let cartDetails = await Cart.findOne({
        _id: cartId,
        user: req.user._id,
      }).populate({
        path: "items.productId",
        select: "name price total",
      });
      if (!cartDetails) {
        return next(AppError.badRequest("Cart not found"));
      }
      const payload = {
        user: req.user._id,
        name: req.body.name,
        address: req.body.address,
        deliveryCharges: req.body.deliveryCharges,
        total: cartDetails.subTotal + Number.parseInt(req.body.deliveryCharges),
        products: cartDetails.items,
      };
      let order = new Order(payload);
      const validateError = order.validateSync();
      if (validateError) {
        next(AppError.badRequest(validateError.message));
      }
      order = await order.save();
      return res.status(200).json({ success: true, order });
    } catch (err) {
      next(err);
    }
  };

  getOrders = async (req, res, next) => {
    try {
      const orders = await Order.find({ user: req.user._id });
      return res.status(200).json({ success: true, orders });
    } catch (err) {
      next(err);
    }
  };
  updateOrderStatus = async (req, res, next) => {
    const { orderId, status } = req.body;
    try {
      let order = await Order.findOneAndUpdate(
        { _id: orderId, user: req.user._id },
        { orderStatus: status },
        { new: true }
      );
      if (!order) {
        return next(AppError.badRequest("Order not found"));
      }
      return res.status(200).json({ success: true, order });
    } catch (err) {
      next(err);
    }
  };
}
module.exports = new OrderController();
