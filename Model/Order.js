const mongoose = require("mongoose");

const OrderSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    cart: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Cart",
    },
    address: {
      type: String,
      required: true,
    },
    name: {
      type: String,
      required: true,
    },
    deliveryCharges: {
      type: Number,
      required: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Order", OrderSchema);
