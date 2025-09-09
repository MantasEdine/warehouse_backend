import express from "express";
import {
  getAllDrivers,
  updateDriver,
  deleteDriver,
  removeDriverProduct
} from "../controllers/deliveryGuyController.js";
import { protect } from "../middlewares/authMiddlewares.js";
import DeliveryGuy from "../models/DeliveryGuy.js";
const router = express.Router();

// Base path: /api/drivers (set in server.js)
router.get("/", getAllDrivers);
router.patch("/:id", protect, updateDriver);
router.delete("/:id", protect, deleteDriver);
router.patch("/:id/remove", protect, removeDriverProduct); // 👈 fixed path
router.get("/:id", async (req, res) => {
  try {
    const driver = await DeliveryGuy.findById(req.params.id);
    if (!driver) return res.status(404).json({ message: "Driver not found" });
    res.json(driver);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});
export default router;
