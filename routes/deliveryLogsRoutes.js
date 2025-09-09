import express from "express";
import {
  createDeliveryLog,
  getAllDeliveryLogs,
  getDeliveryLogById,
} from "../controllers/deliveryLogsController.js";
import { protect } from "../middlewares/authMiddlewares.js";
import multer from "multer";

const router = express.Router();

// Multer config for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "tempUploads"); // temp folder, we move it later in controller
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + "_" + file.originalname);
  },
});
const upload = multer({ storage });

// Routes
router.get("/", protect, getAllDeliveryLogs);
router.get("/:id", protect, getDeliveryLogById);
router.post("/", protect, upload.array("imageProof", 10), createDeliveryLog);

export default router;
