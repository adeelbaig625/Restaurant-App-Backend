const express = require("express");
const app = express();
const connectDB = require("./connectDb");
const port = 3000;

app.get("/", (req, res) => {});

app.listen(port, async () => {
  await connectDB();
  console.log(`Server is running on port ${port}`);
});
