
import express from "express"
import Service from "../models/Service.js"
const r=express.Router()

r.get("/",async(req,res)=>{
const data = await Service.find()
res.json(data)
})

r.post("/",async(req,res)=>{
const data = await Service.create(req.body)
res.json(data)
})

r.put("/:id",async(req,res)=>{
const data = await Service.findByIdAndUpdate(req.params.id, req.body, { new: true })
if(!data) return res.status(404).json({message:"service not found"})
res.json(data)
})

r.delete("/:id",async(req,res)=>{
const data = await Service.findByIdAndDelete(req.params.id)
if(!data) return res.status(404).json({message:"service not found"})
res.json({message:"deleted"})
})

export default r
