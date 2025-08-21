import mongoose from "mongoose";
import bcrypt from "bcrypt";

const UserSchema = new mongoose.Schema({
     name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: {type : String , enum : ["admin","driver"],default : driver}
},{timestamps : true});



// I will hash password here before saving 
// Akram ! hashing means making simply encrypting 

UserSchema.pre('save', async function (next) {
     if(!this.isModified('password')) return next();
     this.password = await bcrypt.hash(this.password , 10);
     next();
})



UserSchema.methods.matchPassword = async function (enteredPassword) {
    return await bcrypt.compare(enteredPassword,this.password);
}



const User = mongoose.model("User",UserSchema);
export default User;
