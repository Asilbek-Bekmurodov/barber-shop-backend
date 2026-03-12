
import mongoose from "mongoose"

const schema = new mongoose.Schema({
userId:{type:mongoose.Schema.Types.ObjectId,ref:"User"},
userName:String,
userEmail:String,
barberId:{type:mongoose.Schema.Types.ObjectId,ref:"Barber"},
rating:Number,
comment:String
},{timestamps:true})

export default mongoose.model("Review",schema)
