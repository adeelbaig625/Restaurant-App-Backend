const express = require("express");
const app = express();
const connectDB = require("./connectDb");
const passport = require("passport");
const port = 3000;
app.use(express.json());
app.use(passport.initialize());
require("./config/passport")(passport);
app.get("/", (req, res) => {});

app.listen(port, async () => {
  await connectDB();
  console.log(`Server is running on port ${port}`);
});
