import User from "../models/User.js"
import {generateToken , logoutUser} from "../services/authServices.js";


// Register new User 

export const register = async(req,res) =>{
    try {
        const {name , email , role , password} = req.body;
        const userExists = await User.findOne({email});
        if(userExists){
            return res.status(400).json({message : "User Already Exist , oopsi"});

        }
        const user = await User.create({name , email , role , password});
        const token = await generateToken(user);
        res.status(201).json({token , user : {id: user._id , name : user.name , role : user.role}});
    } catch (err){
         res.status(500).json({ error: err.message });
    }
}

export const login = async (req,res) =>{
    try {
        const {email , password} = req.body;
        const user = await User.findOne({email});
        if(user && (await user.matchPassword(password))){
           const token = await generateToken(user);
           return res.status(200).json({token , user : {id: user._id , name : user.name , role : user.role}});
        }
        res.status(401).json({message : "Invalid credentials"});
    } catch (err) {
           res.status(500).json({ error: err.message });
    }

}

export const logout = async (req,res,next) => {
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
