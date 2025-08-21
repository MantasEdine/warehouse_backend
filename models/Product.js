
import mongoose from "mongoose";


const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      unique: true,   // i think it should always be unique
      // maybe later i have to add the option for product no to have space 
    },
    quantity: {
      type: Number,
      required: true,
      min: 0,         // i think product stock should never be negative 
    },
  },
  {
    timestamps: true, // adds createdAt & updatedAt automatically
  }
);

const Product = mongoose.model("Product",productSchema);
export default Product