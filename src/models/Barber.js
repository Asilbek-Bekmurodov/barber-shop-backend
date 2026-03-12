
import mongoose from "mongoose"

const schema = new mongoose.Schema({
name:String,
firstName:String,
lastName:String,
phone:String,
experience:Number,
speciality:String,
rating:Number,
workingHours:{
start:String,
end:String
},
daysOff:[String],
image:String
})

export default mongoose.model("Barber",schema)
