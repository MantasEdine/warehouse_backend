import express from "express";
import {
  getAllDrivers,
  updateDriver,
  deleteDriver,
} from "../controllers/deliveryGuyController.js";

const router = express.Router();

// Base path: /api/drivers
router.get("/", getAllDrivers);
router.patch("/:id", updateDriver);
router.delete("/:id", deleteDriver);

export default router;
