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
  },
  {
    timestamps: true, // adds createdAt & updatedAt automatically
  }
);

const Product = mongoose.model("Product", productSchema);
export default Product;
