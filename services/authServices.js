import Token from "../models/Token";
import jwt from "jsonwebtoken";

export const generateToken = async (user) =>{
    const token = jwt.sign(
        {
            id: user._id , role : user.role
        },
        process.env.JWT_SECRET
    )
   await Token.create({token , user: user._id});
   return token;
};

export const logoutUser = async (token) => {
    await Token.deleteOne({token});
};