import mongoose from "mongoose";
import User from "./User";

const DeliveryGuySchema = new mongoose.Schema(
  {
    _id: { type: mongoose.Schema.Types.ObjectId, ref: "User" }, // same id as User
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true },
    truckModel: { type: String, default: "" },
    phoneNumber : {type : String  , unique : true},
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
