const router = require("express").Router();
const passport = require("passport");
const UserController = require("../Controller/User");
const CartController = require("../Controller/Cart");
router.post("/Signup", UserController.signup);
router.post("/Login", UserController.login);
router.get(
  "/Profile",
  passport.authenticate("jwt", { session: false }),
  UserController.profile
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
module.exports = router;
