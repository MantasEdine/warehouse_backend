import DeliveryLog from "../models/DeliveryLog.js";
import DeliveryGuy from "../models/DeliveryGuy.js";
import Product from "../models/Product.js";
import Store from "../models/Store.js";
import fs from "fs";
import path from "path";
import {io} from "../server.js"
import mongoose from "mongoose";
// @desc    Create a new delivery log
// @route   POST /api/delivery-logs
// @desc    Create a new delivery log
// @route   POST /api/delivery-logs
export const createDeliveryLog = async (req, res) => {
  try {
    const { deliveryGuyId, storeId, products } = req.body;

    if (!deliveryGuyId || !storeId || !products || products.length === 0) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    const deliveryGuy = await DeliveryGuy.findById(deliveryGuyId);
    const store = await Store.findById(storeId);
    if (!deliveryGuy) return res.status(404).json({ message: "DeliveryGuy not found" });
    if (!store) return res.status(404).json({ message: "Store not found" });

    // ✅ Validate driver stock
    for (const item of products) {
      const ownedItem = deliveryGuy.productsOwned.find(
        (p) => p.product.toString() === item.productId
      );

      if (!ownedItem || ownedItem.quantity <= 0) {
        return res
          .status(400)
          .json({ message: `Driver has no stock for product ${item.productId}` });
      }

      if (ownedItem.quantity < item.quantity) {
        return res.status(400).json({
          message: `Driver only has ${ownedItem.quantity} units of this product, but tried to deliver ${item.quantity}`,
        });
      }
    }

    // ✅ Deduct driver stock
    products.forEach((item) => {
      const ownedItem = deliveryGuy.productsOwned.find(
        (p) => p.product.toString() === item.productId
      );
      if (ownedItem) {
        ownedItem.quantity -= item.quantity;
      }
    });
    await deliveryGuy.save();

    // ✅ Build product log + total price
    let totalPrice = 0;
    const productLogs = [];

    for (const item of products) {
      const productId = item.productId;
      let product = null;

      if (mongoose.Types.ObjectId.isValid(productId)) {
        product = await Product.findById(productId);
      }

      const price = product?.price ? Number(product.price) : Number(item.price);
      const quantity = Number(item.quantity);
      const total = price * quantity;
      totalPrice += total;

      productLogs.push({
        product: product?._id || productId,
        quantity,
        price,
        total,
      });
    }

    // ✅ Handle image uploads
    const imagePaths = [];
    if (req.files && req.files.length > 0) {
      const dest = path.join("uploads", "deliveryProofs");
      if (!fs.existsSync(dest)) fs.mkdirSync(dest, { recursive: true });

      req.files.forEach((file) => {
        const filePath = path.join(dest, file.originalname);
        fs.renameSync(file.path, filePath);
        imagePaths.push(filePath);
      });
    }

    // ✅ Create delivery log
    const log = await DeliveryLog.create({
      deliveryGuy: deliveryGuy._id,
      store: store._id,
      products: productLogs,
      totalPrice,
      deliveredAt: new Date(),
      receipt: "",
      notes: "",
      status: "completed",
      createdBy: req.user?._id || null,
    });
    io.emit("newDeliveryLog", log);

    // ✅ Add products to store history
    store.productsDelivered.push(
      ...productLogs.map((p) => ({
        product: p.product,
        quantity: p.quantity,
        deliveryGuy: deliveryGuy._id,
        imageProof: imagePaths,
      }))
    );
    await store.save();

    const populatedLog = await DeliveryLog.findById(log._id)
      .populate("deliveryGuy", "name email")
      .populate("store", "name location")
      .populate("products.product", "name price");

    res.status(201).json(populatedLog);
  } catch (err) {
    console.error("Create DeliveryLog error:", err);
    res.status(500).json({ error: err.message });
  }
};

// @desc    Get all delivery logs
// @route   GET /api/delivery-logs
export const getAllDeliveryLogs = async (req, res) => {
  try {
    const logs = await DeliveryLog.find()
      .populate("deliveryGuy", "name email")
      .populate("store", "name location")
      .populate("products.product", "name price")
      .sort({ deliveredAt: -1 });

    res.status(200).json(logs);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
};

// @desc    Get one delivery log by ID
// @route   GET /api/delivery-logs/:id
export const getDeliveryLogById = async (req, res) => {
  try {
    const log = await DeliveryLog.findById(req.params.id)
      .populate("deliveryGuy", "name email")
      .populate("store", "name location")
      .populate("products.product", "name price");

    if (!log) return res.status(404).json({ message: "Delivery log not found" });

    res.status(200).json(log);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
};
