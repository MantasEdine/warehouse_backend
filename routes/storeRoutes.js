import express from "express";
import {
  getAllStores,
  getStoreById,
  createStore,
  updateStore,
  deleteStore,
} from "../controllers/storeController.js";


const router = express.Router();

// Base path: /api/stores
router.get("/", getAllStores);
router.get("/:id", getStoreById);
router.post("/", createStore);
router.patch("/:id", updateStore);
router.delete("/:id", deleteStore);

export default router;
