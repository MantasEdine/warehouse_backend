import Token from "../models/Token.js";
import jwt from "jsonwebtoken";

export const generateToken = async (user) =>{
    const token = jwt.sign(
        {
            id: user._id , role : user.role
        },
        process.env.JWT_SECRET
    )
   try {
    await Token.create({token , user: user._id});
   } catch (err) {
    console.error("Failed to save token:", err.message);
  }
   
   return token;
};

export const logoutUser = async (token) => {
  const result = await Token.deleteOne({ token });
  // result.deletedCount === 1 if deletion happened
  return result.deletedCount === 1;
};
