import mongoose from "mongoose";

const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true, // avoid duplicates like "Apple" vs "apple"
    },
    quantity: {
      type: Number,
      required: true,
      min: 0,
    },
    price: {
      type: Number,
      required: true,
      min: 0,
      default: 0, // in Algerian Dinar (DZA)
    },
    currency: {
      type: String,
      default: "DZA",
      enum: ["DZA"], // lock to Algerian Dinar
    },
  },
  {
    timestamps: true, // adds createdAt & updatedAt automatically
  }
);

const Product = mongoose.model("Product", productSchema);
export default Product;
