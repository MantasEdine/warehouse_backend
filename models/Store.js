import mongoose from "mongoose";

const storeSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    productsDelivered: [
      {
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
        deliveryGuy: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "DeliveryGuy",
          required: true,
        },
        imageProof: {
          type: [String], // URLs to proof images
          validate: {
            validator: (arr) => arr.every((url) => typeof url === "string"),
            message: "Image proof must be an array of strings (URLs)",
          },
        },
      },
    ],
  },
  {
    timestamps: true,
  }
);

const Store = mongoose.model("Store", storeSchema);
export default Store;
