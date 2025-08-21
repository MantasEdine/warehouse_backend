import User from "../models/User.js"
import {generateToken , logoutUser} from "../services/authService.js";


// Register new User 

export const register = async(req,res,next) =>{
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
      next(err);
    }
}

export const login = async (req,res , next) =>{
    try {
        const {email , password} = req.body;
        const user = await User.findOne({email});
        if(user && (await user.matchPassword(password))){
           const token = await generateToken(user);
           return res.json({token , user : {id: user._id , name : user.name , role : user.role}});
        }
        res.status(401).json({message : "Invalid credentials"});
    } catch (err) {
        next(err);
    }

}

export const logout = async (req,res,next) =>{
    try {
        
       const token = req.headers.authorization.split(" ")[1];
       await logoutUser(token)     
 
          
    } catch (err) {
      next(err);  
    }
}
