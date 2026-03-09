
import mongoose from "mongoose"

const schema = new mongoose.Schema({
userId:{type:mongoose.Schema.Types.ObjectId,ref:"User"},
barberId:{type:mongoose.Schema.Types.ObjectId,ref:"Barber"},
serviceId:{type:mongoose.Schema.Types.ObjectId,ref:"Service"},
date:String,
startTime:String,
status:{
type:String,
enum:["pending","confirmed","completed","cancelled"],
default:"pending"
}
},{timestamps:true})

export default mongoose.model("Booking",schema)
