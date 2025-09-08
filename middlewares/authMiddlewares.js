import jwt from "jsonwebtoken";
import Token from "../models/Token.js";
import User from "../models/User.js";

// Protect routes (require authentication)
export const protect = async (req, res, next) => {
  const authHeader = req.headers["authorization"];

  if (!authHeader?.startsWith("Bearer ")) {
    return res.status(401).json({ message: "Not authorized, no token" });
  }

  const token = authHeader.split(" ")[1];

  // Check if token is still valid (not logged out)
  const tokenDoc = await Token.findOne({ token });
  if (!tokenDoc) {
    return res.status(401).json({ message: "Logged out or invalid token" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = await User.findById(decoded.id).select("-password");

    if (!req.user) {
      return res.status(401).json({ message: "User not found" });
    }

    next();
  } catch (err) {
    return res.status(401).json({ message: "Invalid or expired token" });
  }
};

// Restrict routes to admins only
export const adminOnly = (req, res, next) => {
  if (req.user?.role !== "admin") {
    return res.status(403).json({ message: "Admin only" });
  }
  next();
};


