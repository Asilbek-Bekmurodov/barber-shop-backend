
import express from "express"
import Barber from "../models/Barber.js"
const r=express.Router()

r.get("/",async(req,res)=>{
const data = await Barber.find()
res.json(data)
})

r.post("/",async(req,res)=>{
const data = await Barber.create(req.body)
res.json(data)
})

export default r
