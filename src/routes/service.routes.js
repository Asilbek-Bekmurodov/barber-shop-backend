
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

export default r
