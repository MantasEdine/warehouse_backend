import express from "express";
import {
  getAllDrivers,
  updateDriver,
  deleteDriver,
  removeDriverProduct
} from "../controllers/deliveryGuyController.js";
import { protect } from "../middlewares/authMiddlewares.js";

const router = express.Router();

// Base path: /api/drivers
router.get("/", getAllDrivers);
router.patch("/:id", protect , updateDriver);
router.delete("/:id", protect , deleteDriver);
router.patch("/api/drivers/:id/remove", protect, removeDriverProduct);


export default router;
