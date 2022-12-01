const router = require("express").Router();
const User = require("../Model/User");
const UserController = require("../Controller/User");
router.post("/Signup", UserController.signup);

module.exports = router;
