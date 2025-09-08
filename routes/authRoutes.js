import express from "express";
import {register , login , logout} from "../controllers/authController.js";
import { registerSchema , loginSchema } from "../validators/authValidator.js";
import {protect} from "../middlewares/authMiddlewares.js"
import  { validate } from "../middlewares/validate.js"
const router = express.Router();

router.post("/register", validate(registerSchema) , register);
router.post("/login", validate(loginSchema) ,  login);
router.post("/logout",  logout);
router.get("/profile", protect, async (req, res) => {
  try {
    res.json({
      id: req.user._id,
      name: req.user.name,
      email: req.user.email,
      role: req.user.role,
    });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});
export default router;