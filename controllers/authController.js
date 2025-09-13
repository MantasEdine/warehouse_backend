import User from "../models/User.js";
import DeliveryGuy from "../models/DeliveryGuy.js";
import { generateToken, logoutUser } from "../services/authServices.js";

// @desc Register new User
export const register = async (req, res) => {
  try {
    const { name, email, role, password, phoneNumber } = req.body;

    // Check if email already exists
    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ message: "Email already exists" });
    }

    // Check if phoneNumber already exists (optional)
    if (phoneNumber) {
      const phoneExists = await User.findOne({ phoneNumber });
      if (phoneExists) {
        return res.status(400).json({ message: "Phone number already exists" });
      }
    }

    const user = await User.create({ name, email, role, password, phoneNumber });

    // If driver, create DeliveryGuy linked to user
    let driver = null;
    if (role === "driver") {
      driver = await DeliveryGuy.create({
        user: user._id,
        name,
        email,
        phoneNumber,
        productsOwned: [],
      });
    }

    const token = await generateToken(user);

    res.status(201).json({
      token,
      user: { id: user._id, name: user.name, email: user.email, role: user.role, phoneNumber },
      driver,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};


// @desc Login
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });

    if (user && (await user.matchPassword(password))) {
      let driver = null;

      if (user.role === "driver") {
        driver = await DeliveryGuy.findOne({ user: user._id }).populate(
          "productsOwned.product"
        );
      }

      const token = await generateToken(user);

      return res.status(200).json({
        token,
        user: { id: user._id, name: user.name, email: user.email, role: user.role },
        driver,
      });
    }

    res.status(401).json({ message: "Invalid credentials" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};


// @desc Logout
export const logout = async (req, res, next) => {
  try {
    const authHeader = req.headers["authorization"];
    if (!authHeader?.startsWith("Bearer ")) {
      return res.status(400).json({ message: "Token required" });
    }

    const token = authHeader.split(" ")[1];
    const deleted = await logoutUser(token);
    if (!deleted) return res.status(404).json({ message: "Token not found" });

    res.status(200).json({ message: "Logged out successfully" });
  } catch (err) {
    console.error("Logout error:", err.message);
    next(err);
  }
};
