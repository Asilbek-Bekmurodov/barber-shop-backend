
import mongoose from "mongoose"

const schema = new mongoose.Schema({
title:String,
price:Number,
duration:Number,
description:String
})

export default mongoose.model("Service",schema)
