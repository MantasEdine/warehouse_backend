import mongoose from "mongoose";

const DeliveryGuySchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true },
    truckModel: { type: String, default: "" },
    productsOwned: [
      {
        product: { type: mongoose.Schema.Types.ObjectId, ref: "Product", required: true },
        quantity: { type: Number, required: true, min: 0 },
      },
    ],
  },
  { timestamps: true }
);

const DeliveryGuy = mongoose.model("DeliveryGuy", DeliveryGuySchema);
export default DeliveryGuy;
