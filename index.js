const express = require("express");
const app = express();
const connectDB = require("./connectDb");
const passport = require("passport");
const port = 3000;
const User = require("./Model/User");

app.use(express.json());
app.use(passport.initialize());
require("./config/passport")(passport);
app.get("/", passport.authenticate("jwt", { session: false }), (req, res) => {
  console.log(req.user);
  res.send("Hello World!");
});
app.post("/Signup", async (req, res) => {
  const { name, email, password } = req.body;
  const user = new User({
    name,
    email,
    password,
  });
  const userData = await user.save();
  const userToken = await user.getSignedJwtToken();
  res.status(200).send({ userData, userToken });
});

connectDB().then(() => {
  app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`);
  });
});
