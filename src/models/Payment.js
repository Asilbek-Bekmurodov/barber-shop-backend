
import mongoose from "mongoose"

const schema = new mongoose.Schema({
bookingId:{type:mongoose.Schema.Types.ObjectId,ref:"Booking"},
amount:Number,
method:{type:String,enum:["click","payme"]},
status:{type:String,enum:["pending","paid","failed"],default:"pending"}
})

export default mongoose.model("Payment",schema)
