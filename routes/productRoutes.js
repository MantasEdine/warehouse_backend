import express from "express";
import { validate } from "../middlewares/validate.js";
import { productSchema } from "../validators/productValidator.js";
import {
  createProduct,
  getAllProducts,
  getOneProduct,
  deleteProduct,
  updateProduct,
} from "../controllers/productController.js";

const router = express.Router();

// Base path is already /api/products from server.js
router.get("/", getAllProducts);
router.get("/:id", getOneProduct);
router.post("/", validate(productSchema), createProduct);
router.patch("/:id", updateProduct);
router.delete("/:id", deleteProduct);

export default router;
