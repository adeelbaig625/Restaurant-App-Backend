const router = require("express").Router();
const passport = require("passport");
const AdminController = require("../Controller/Admin");
router.post("/Signup", AdminController.signup);
router.post("/Login", AdminController.login);
router.get(
  "/Profile",
  passport.authenticate("jwt", { session: false }),
  AdminController.profile
);
router.post(
  "/AddProduct",
  passport.authenticate("jwt", { session: false }),
  AdminController.AddProduct
);
module.exports = router;
