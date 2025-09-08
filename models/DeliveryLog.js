import mongoose from "mongoose";

const DeliveryLogSchema = new mongoose.Schema(
  {
    deliveryGuy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "DeliveryGuy",
      required: true,
    },
    store: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Store",
      required: true,
    },
    product: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Product",
      required: true,
    },
    quantity: {
      type: Number,
      required: true,
      min: 0,
    },
    deliveredAt: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true }
);

const DeliveryLog = mongoose.model("DeliveryLog", DeliveryLogSchema);
export default DeliveryLog;
