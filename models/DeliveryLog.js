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
    products: [
      {
        product: { type: mongoose.Schema.Types.ObjectId, ref: "Product", required: true },
        quantity: { type: Number, required: true, min: 0 },
        price: { type: Number, required: true, min: 0 }, // price per unit at delivery time
        total: { type: Number, required: true, min: 0 }, // quantity * price
      },
    ],
    // DeliveryLogSchema
    totalPrice: {
     type: Number,
     required: true,
     min: 0, // total of all products combined
    },

    deliveredAt: {
      type: Date,
      default: Date.now,
    },
    receipt: {
      type: String, // path to uploaded receipt image
      default: "",
    },
    notes: {
      type: String,
      default: "", // optional: any notes from delivery guy
    },
    status: {
      type: String,
      enum: ["pending", "completed", "canceled"],
      default: "completed",
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: false, // admin who may log the delivery
    },
  },
  {
    timestamps: true, // adds createdAt and updatedAt
  }
);

// Optional: Add virtual field for convenience
DeliveryLogSchema.virtual("productCount").get(function () {
  return this.products.reduce((sum, p) => sum + p.quantity, 0);
});

const DeliveryLog = mongoose.model("DeliveryLog", DeliveryLogSchema);
export default DeliveryLog;
