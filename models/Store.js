import mongoose from "mongoose";

const storeSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      unique : true
    },
    productsDelivered: [
      {
        product: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Product",   // Refers to Product model
          required: true,
        },
        quantity: {
          type: Number,
          required: true,
        },
        deliveryGuy: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "DeliveryGuy",
          required: true,
        },
        imageProof : [String]
      },
    ],
  },
  {
    timestamps: true,
  }
);

const Store = mongoose.model("Store", storeSchema);
export default Store;
