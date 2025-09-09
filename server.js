import express from "express";
import morgan from "morgan";
import dotenv from "dotenv";
import cors from "cors";
import helmet from "helmet";
import createHttpError from "http-errors"; // not used yet
import { connectDB } from "./config/database.js";
import cookieParser from "cookie-parser";
import authRoutes from "./routes/authRoutes.js"
import productsRoutes from "./routes/productRoutes.js"
import deliveryGuyRoutes from "./routes/deliveryGuyRoutes.js";



dotenv.config();

const app = express();

// Middlewares
app.use(morgan("dev"));
app.use(cors());
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(helmet());
app.use(cookieParser());

// Database connection
connectDB();

// Routes
app.get("/", (req, res) => {
  res.send("Hello World 🚀");
});
app.use("/api/auth",authRoutes);
app.use("/api/products",productsRoutes);
app.use("/api/drivers", deliveryGuyRoutes);



// Error handler
app.use((err, req, res, next) => {
  res.status(err.status || 500).json({
    status: err.status || 500,
    message: err.message || "Internal Server Error",
  });
});

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`✅ App listening on PORT: ${PORT}`);
});
