const express = require("express");
const app = express();
const connectDB = require("./utils/connectDb");
const passport = require("passport");
const cors = require("cors");

const User = require("./Model/User");
const UserRoutes = require("./Routes/User");
const AdminRoutes = require("./Routes/Admin");
const ErrorHandler = require("./Middleware/ErrorHandler");
app.use(express.json());
app.use(cors());
app.use(passport.initialize());
require("./config/passport")(passport);
require("dotenv").config();
const port = process.env.PORT || 3000;
app.use("/", UserRoutes);
app.use("/Admin", AdminRoutes);
app.use(ErrorHandler);
connectDB().then(() => {
  app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`);
  });
});
