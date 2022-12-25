const router = require("express").Router();
const passport = require("passport");
const UserController = require("../Controller/User");
const CartController = require("../Controller/Cart");
const OrderController = require("../Controller/Order");
router.post("/Signup", UserController.signup);
router.post("/Login", UserController.login);
router.get(
  "/Profile",
  passport.authenticate("jwt", { session: false }),
  UserController.profile
);
router.put(
  "/UpdatePassword",
  passport.authenticate("jwt", { session: false }),
  UserController.updatePassword
);
router.post(
  "/AddToCart",
  passport.authenticate("jwt", { session: false }),
  CartController.addItemtoCart
);
router.get(
  "/cart",
  passport.authenticate("jwt", { session: false }),
  CartController.getCart
);
router.post(
  "/emptyCart",
  passport.authenticate("jwt", { session: false }),
  CartController.emptyCart
);
router.post(
  "/addOrder",
  passport.authenticate("jwt", { session: false }),
  OrderController.addOrderToUser
);
router.get(
  "/getOrders",
  passport.authenticate("jwt", { session: false }),
  OrderController.getOrders
);
router.get("/SendEmail", UserController.sendEmail);
router.post("/ResetPasswordEmail", UserController.sendResetPasswordEmail);
router.post("/ResetPassword/:userId/:token", UserController.resetPassword);

module.exports = router;
