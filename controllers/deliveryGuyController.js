import User from "../models/User.js";
import DeliveryGuy from "../models/DeliveryGuy.js";
import Product from "../models/Product.js";

// @desc Get all drivers
// @route GET /api/drivers
export const getAllDrivers = async (req, res) => {
  try {
    const drivers = await DeliveryGuy.find().populate("productsOwned.product");
    if (!drivers.length) return res.status(404).json({ message: "No drivers found" });
    res.status(200).json(drivers);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// @desc Update driver info & products
// @route PATCH /api/drivers/:id
export const updateDriver = async (req, res, next) => {
  try {
    console.log("PATCH request body:", req.body)
    const { id } = req.params;
    const userRole = req.user.role;
    console.log(req.user)
    const userId = req.user._id;

    const driver = await DeliveryGuy.findById(id).populate("productsOwned.product");
    if (!driver) return res.status(404).json({ message: "Driver not found" });

    // DRIVER RESTRICTIONS
    if (userRole === "driver") {
      if (driver.user.toString() !== userId.toString()) {
        return res.status(403).json({ message: "Forbidden" });
      }
      if (!req.body.productsOwned) {
        return res.status(400).json({ message: "No products provided to update" });
      }

      await Promise.all(
        req.body.productsOwned.map(async (updateItem) => {
          const existingItem = driver.productsOwned.find(
            (p) => p.product._id.toString() === updateItem.productId
          );
          if (!existingItem) return;

          const product = await Product.findById(existingItem.product._id);
          const delta = updateItem.quantity - existingItem.quantity;
          product.quantity -= delta;
          if (product.quantity < 0) product.quantity = 0;
          await product.save();

          existingItem.quantity = updateItem.quantity;
        })
      );

      await driver.save();
      return res.status(200).json(driver);
    }

    // ADMIN CAN UPDATE EVERYTHING
    const { name, email, truckModel, productsOwned } = req.body;
    if (name) driver.name = name;
    if (email) driver.email = email;
    if (truckModel) driver.truckModel = truckModel;

    if (productsOwned) {
      await Promise.all(
        productsOwned.map(async (updateItem) => {
          const existingItem = driver.productsOwned.find(
            (p) => p.product.toString() === updateItem.productId
          );
          const product = await Product.findById(updateItem.productId);
          if (!product) return;

          if (existingItem) {
            const delta = updateItem.quantity - existingItem.quantity;
            product.quantity -= delta;
            if (product.quantity < 0) product.quantity = 0;
            await product.save();
            existingItem.quantity = updateItem.quantity;
          } else {
            driver.productsOwned.push({
              product: updateItem.productId,
              quantity: updateItem.quantity,
            });
            product.quantity -= updateItem.quantity;
            if (product.quantity < 0) product.quantity = 0;
            await product.save();
          }
        })
      );
    }

    await driver.save();
    return res.status(200).json(driver);
  } catch (err) {
    console.error("Update driver error:", err);
    next(err);
  }
};

// @desc Delete driver and restore stock
// @route DELETE /api/drivers/:id
export const deleteDriver = async (req, res) => {
  try {
    const driver = await DeliveryGuy.findById(req.params.id);
    if (!driver) return res.status(404).json({ message: "Driver not found" });

    // restore stock
    await Promise.all(
      driver.productsOwned.map(async (item) => {
        const product = await Product.findById(item.product);
        if (product) {
          product.quantity += item.quantity;
          await product.save();
        }
      })
    );

    // delete linked user + driver
    await User.findByIdAndDelete(driver.user);
    await DeliveryGuy.findByIdAndDelete(driver._id);

    res.status(200).json({ message: "Driver and linked user deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
