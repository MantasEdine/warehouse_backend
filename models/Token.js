
import mongoose from "mongoose";

const TokenSchema = new mongoose.Schema({
    Token : {
        type : String,
        required : true
    },
    user : {
        type : mongoose.Schema.Types.ObjectId,
        ref : "User",
        required : true
    }
},{timestamps : true});

export default mongoose.model("Token",TokenSchema);