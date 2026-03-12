
import mongoose from "mongoose"

const schema = new mongoose.Schema({
barberId:{type:mongoose.Schema.Types.ObjectId,ref:"Barber"},
title:String,
price:Number,
duration:Number,
description:String
})

export default mongoose.model("Service",schema)
