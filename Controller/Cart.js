const Cart = require("../Model/Cart");
const Product = require("../Model/Product");
const AppError = require("../AppError");

class CartController {
  cart = async (uid) => {
    const carts = await Cart.find({ user: uid }).populate({
      path: "items.productId",
      select: "name price total",
    });
    return carts[0];
  };
  addItem = async (payload) => {
    const newItem = await Cart.create(payload);
    return newItem;
  };

  addItemtoCart = async (req, res, next) => {
    const { productId } = req.body;
    const quantity = Number.parseInt(req.body.quantity);
    try {
      let cart = await this.cart(req.user._id);
      let productDetails = await Product.findById(productId);
      if (!productDetails) {
        return next(AppError.badRequest("Product not found"));
      }
      console.log(parseInt(productDetails.price[0] * quantity));
      if (!cart) {
        const payload = {
          user: req.user._id,
          items: [
            {
              productId: productId,
              quantity: quantity,
              price: productDetails.price[0],
              total: parseInt(productDetails.price[0] * quantity),
            },
          ],
          subTotal: parseInt(productDetails.price[0] * quantity),
        };
        cart = await this.addItem(payload);
        return res.status(200).json({ success: true, cart });
      } else {
        const indexFound = cart.items.findIndex(
          (item) => item.productId.id == productId
        );
        if (indexFound != -1 && quantity <= 0) {
          cart.items.splice(indexFound, 1);
          if (cart.items.length == 0) {
            cart.subTotal = 0;
          } else {
            cart.subTotal = cart.items
              .map((item) => item.total)
              .reduce((acc, next) => acc + next);
          }
        } else if (indexFound != -1) {
          cart.items[indexFound].quantity =
            cart.items[indexFound].quantity + quantity;
          cart.items[indexFound].total =
            cart.items[indexFound].quantity * cart.items[indexFound].price;
          cart.subTotal = cart.items
            .map((item) => item.total)
            .reduce((acc, next) => acc + next);
          cart.items[indexFound].price = productDetails.price[0];
        } else if (quantity > 0) {
          cart.items.push({
            productId: productId,
            quantity: quantity,
            price: productDetails.price[0],
            total: parseInt(productDetails.price[0] * quantity),
          });
          cart.subTotal = cart.items
            .map((item) => item.total)
            .reduce((acc, next) => acc + next);
        } else {
          return next(AppError.badRequest("Invalid request"));
        }
      }
      let data = await cart.save();
      return res.status(200).json({ success: true, cart: data });
    } catch (err) {
      next(err);
    }
  };

  getCart = async (req, res, next) => {
    try {
      let cart = await this.cart(req.user._id);
      if (!cart) {
        return res.status(200).json({ success: true, cart: {} });
      }
      return res.status(200).json({ success: true, cart });
    } catch (err) {
      return next(err);
    }
  };

  emptyCart = async (req, res, next) => {
    try {
      let cart = await this.cart(req.user._id);
      if (!cart) {
        return res.status(200).json({ success: true, cart: {} });
      }
      cart.items = [];
      cart.subTotal = 0;
      await cart.save();
      return res.status(200).json({ success: true, cart: {} });
    } catch (err) {
      return next(err);
    }
  };
}
module.exports = new CartController();
