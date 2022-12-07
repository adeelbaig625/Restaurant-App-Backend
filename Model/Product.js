const mongoose = require("mongoose");
const PrdouctSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  price: {
    type: Array,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  image: {
    type: String,
    required: true,
  },
});
