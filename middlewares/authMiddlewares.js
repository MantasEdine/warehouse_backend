import jwt from "jsonwebtoken";
import Token from "../models/Token";
import User from "../models/User";

export const protect = async(req,res,next) =>{
    const authHeader = req.headers.authorization;
    if(!authHeader?.startsWith("Bearer")){
        return res.status(401).json({message : "Not authorized , no token"});
    }


   const token = authHeader.split(" ")[1];
   const tokenDoc = await Token.findOne({ token });
   if (!tokenDoc) return res.status(401).json({message : "Logged out or invalid token"});


  try{

    const decoded = jwt.verify(token , process.env.JWT_SECRET);
    req.user = await User.findById(decoded.id).select("-password");
    next();

  } catch(err){
     res.status(404).json({message : "Token invalid"});
 }

};


export const adminOnly = (req,res,next) =>{
    if(req.user?.role !== "admin"){
        return res.status(403).json({message:"Admin Only"});
        next();
    };
}