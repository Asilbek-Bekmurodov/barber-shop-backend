
import mongoose from "mongoose"

const schema = new mongoose.Schema({
name:String,
email:{type:String,unique:true},
password:String,
role:{type:String,enum:["superadmin","admin","barber","client"],default:"client"}
},{timestamps:true})

export default mongoose.model("User",schema)
