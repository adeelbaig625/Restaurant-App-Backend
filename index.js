const express = require("express");
const app = express();
const connectDB = require("./connectDb");
const passport = require("passport");
const port = 3000;
const User = require("./Model/User");
const UserRoutes = require("./Routes/User");

app.use(express.json());
app.use(passport.initialize());
require("./config/passport")(passport);
app.get("/", passport.authenticate("jwt", { session: false }), (req, res) => {
  console.log(req.user);
  res.send("Hello World!");
});

app.use("/", UserRoutes);
connectDB().then(() => {
  app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`);
  });
});
