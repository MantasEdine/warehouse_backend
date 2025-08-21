import mongoose from "mongoose";

const TokenSchema = new mongoose.Schema({
  token: { type: String, required: true, unique: true },
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  createdAt: { type: Date, default: Date.now, expires: "7d" } // auto-expire tokens after 7 days
});

const Token = mongoose.model("Token", TokenSchema);
export default Token;
