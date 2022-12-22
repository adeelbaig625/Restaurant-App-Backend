const router = require("express").Router();
const passport = require("passport");
const AdminController = require("../Controller/Admin");
const OrderController = require("../Controller/Order");
router.post("/Signup", AdminController.signup);
router.post("/Login", AdminController.login);
router.get(
  "/Profile",
  passport.authenticate("jwt", { session: false }),
  AdminController.profile
);
router.put(
  "/Update",
  passport.authenticate("jwt", { session: false }),
  AdminController.update
);
router.put(
  "/UpdatePassword",
  passport.authenticate("jwt", { session: false }),
  AdminController.updatePassword
);
router.post(
  "/AddProduct",
  passport.authenticate("jwt", { session: false }),
  AdminController.AddProduct
);
router.put(
  "/UpdateProduct/:id",
  passport.authenticate("jwt", { session: false }),
  AdminController.UpdateProduct
);

router.put(
  "/UpdateOrder/:id",
  passport.authenticate("jwt", { session: false }),
  OrderController.updateOrderStatus
);

module.exports = router;
