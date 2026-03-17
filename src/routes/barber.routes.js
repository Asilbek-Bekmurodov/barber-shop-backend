
import express from "express"
import multer from "multer"
import mongoose from "mongoose"
import Barber from "../models/Barber.js"
import Booking from "../models/Booking.js"
import Service from "../models/Service.js"
import User from "../models/User.js"
import { uploadFileToR2 } from "../controllers/upload.controller.js"
import { requireAuth } from "../middleware/auth.js"
import { requireRole } from "../middleware/requireRole.js"
const r=express.Router()
const upload = multer({dest:"uploads/"})

const toMinutes = (hhmm)=>{
  if(typeof hhmm!=="string") return null
  const m = hhmm.trim().match(/^([01]?\\d|2[0-3]):([0-5]\\d)$/)
  if(!m) return null
  return parseInt(m[1],10)*60 + parseInt(m[2],10)
}

const toTime = (mins)=>{
  const h = Math.floor(mins/60)
  const m = mins%60
  return `${String(h).padStart(2,"0")}:${String(m).padStart(2,"0")}`
}

const isDayOff = (daysOff,dateStr)=>{
  if(!Array.isArray(daysOff) || daysOff.length===0) return false
  const date = new Date(dateStr)
  if(Number.isNaN(date.getTime())) return false
  const days = ["sunday","monday","tuesday","wednesday","thursday","friday","saturday"]
  const dayName = days[date.getUTCDay()]
  const dayShort = dayName.slice(0,3)
  const set = new Set(daysOff.map(d=>String(d).toLowerCase()))
  return set.has(dateStr.toLowerCase()) || set.has(dayName) || set.has(dayShort)
}

const loadBarber = async (req,res,next)=>{
  if(!mongoose.isValidObjectId(req.params.id)){
    return res.status(400).json({message:"barber id must be a valid ObjectId"})
  }

  const barber = await Barber.findById(req.params.id)
  if(!barber) return res.status(404).json({message:"barber not found"})

  req.barber = barber
  next()
}

const requireBarberOwnership = (req,res,next)=>{
  if(!req.user) return res.status(401).json({message:"Unauthorized"})

  if(["superadmin","admin"].includes(req.user.role)){
    return next()
  }

  if(req.user.role !== "barber"){
    return res.status(403).json({message:"Forbidden"})
  }

  if(!req.barber?.userId){
    return res.status(403).json({message:"barber profile is not linked to a user"})
  }

  if(String(req.barber.userId) !== String(req.user._id)){
    return res.status(403).json({message:"Forbidden"})
  }

  next()
}

r.get("/",async(req,res)=>{
const data = await Barber.find()
res.json(data)
})

r.get("/:id",loadBarber,async(req,res)=>{
res.json(req.barber)
})

r.post("/",requireAuth,requireRole("superadmin","admin"),async(req,res)=>{
const data = await Barber.create(req.body)
res.json(data)
})

r.post("/:id/link-user",requireAuth,requireRole("superadmin","admin"),loadBarber,async(req,res)=>{
  const { userId } = req.body || {}
  if(!mongoose.isValidObjectId(userId)){
    return res.status(400).json({message:"userId must be a valid ObjectId"})
  }

  const user = await User.findById(userId)
  if(!user) return res.status(404).json({message:"user not found"})
  if(user.role !== "barber"){
    return res.status(400).json({message:"user role must be barber"})
  }

  const existing = await Barber.findOne({ userId, _id: { $ne: req.barber._id } })
  if(existing){
    return res.status(400).json({message:"user already linked to another barber"})
  }

  req.barber.userId = user._id
  await req.barber.save()

  res.json(req.barber)
})

r.post("/:id/photo",requireAuth,loadBarber,requireBarberOwnership,upload.single("image"),async(req,res)=>{
  if(!req.file) return res.status(400).json({message:"No file uploaded"})
  const barber = req.barber

  try{
    const url = await uploadFileToR2(req.file)
    barber.image = url
    await barber.save()
    return res.json({url,barber})
  }catch(err){
    return res.status(500).json({message:"Upload failed"})
  }
})

r.get("/:id/services",async(req,res)=>{
  const barber = await Barber.findById(req.params.id)
  if(!barber) return res.status(404).json({message:"barber not found"})
  const services = await Service.find({barberId:barber._id})
  res.json(services)
})

r.post("/:id/services",requireAuth,loadBarber,requireBarberOwnership,async(req,res)=>{
  const barber = req.barber
  const service = await Service.create({
    ...req.body,
    barberId: barber._id,
  })
  res.status(201).json(service)
})

r.put("/:id/services/:serviceId",requireAuth,loadBarber,requireBarberOwnership,async(req,res)=>{
  const barber = req.barber
  const updated = await Service.findOneAndUpdate(
    { _id: req.params.serviceId, barberId: barber._id },
    req.body,
    { new: true }
  )
  if(!updated) return res.status(404).json({message:"service not found"})
  res.json(updated)
})

r.delete("/:id/services/:serviceId",requireAuth,loadBarber,requireBarberOwnership,async(req,res)=>{
  const barber = req.barber
  const deleted = await Service.findOneAndDelete({ _id: req.params.serviceId, barberId: barber._id })
  if(!deleted) return res.status(404).json({message:"service not found"})
  res.json({message:"deleted"})
})

r.get("/:id/availability",async(req,res)=>{
  const {date,slotMinutes}=req.query
  if(!date) return res.status(400).json({message:"date query param required (YYYY-MM-DD)"})

  const barber = await Barber.findById(req.params.id)
  if(!barber) return res.status(404).json({message:"barber not found"})

  const start = barber?.workingHours?.start
  const end = barber?.workingHours?.end
  const startMin = toMinutes(start)
  const endMin = toMinutes(end)
  if(startMin===null || endMin===null || endMin<=startMin){
    return res.status(400).json({message:"invalid barber workingHours"})
  }

  const dateObj = new Date(date)
  if(Number.isNaN(dateObj.getTime())){
    return res.status(400).json({message:"invalid date (use YYYY-MM-DD)"})
  }

  if(isDayOff(barber.daysOff,date)){
    return res.json({date,slots:[],slotMinutes:Number(slotMinutes)||30})
  }

  const size = Number.parseInt(slotMinutes||"30",10)
  const slotSize = Number.isFinite(size) && size>0 ? size : 30

  const bookings = await Booking.find({barberId:barber._id,date})
  const booked = new Set()
  for(const b of bookings){
    const m = toMinutes(b.startTime)
    if(m!==null) booked.add(toTime(m))
  }

  const slots=[]
  for(let t=startMin; t+slotSize<=endMin; t+=slotSize){
    const label = toTime(t)
    if(!booked.has(label)) slots.push(label)
  }

  res.json({date,slots,slotMinutes:slotSize})
})

export default r
