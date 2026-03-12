
import express from "express"
import multer from "multer"
import Barber from "../models/Barber.js"
import Booking from "../models/Booking.js"
import Service from "../models/Service.js"
import { uploadFileToR2 } from "../controllers/upload.controller.js"
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

r.get("/",async(req,res)=>{
const data = await Barber.find()
res.json(data)
})

r.post("/",async(req,res)=>{
const data = await Barber.create(req.body)
res.json(data)
})

r.post("/:id/photo",upload.single("image"),async(req,res)=>{
  if(!req.file) return res.status(400).json({message:"No file uploaded"})

  const barber = await Barber.findById(req.params.id)
  if(!barber) return res.status(404).json({message:"barber not found"})

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

r.post("/:id/services",async(req,res)=>{
  const barber = await Barber.findById(req.params.id)
  if(!barber) return res.status(404).json({message:"barber not found"})
  const service = await Service.create({
    ...req.body,
    barberId: barber._id,
  })
  res.status(201).json(service)
})

r.put("/:id/services/:serviceId",async(req,res)=>{
  const barber = await Barber.findById(req.params.id)
  if(!barber) return res.status(404).json({message:"barber not found"})
  const updated = await Service.findOneAndUpdate(
    { _id: req.params.serviceId, barberId: barber._id },
    req.body,
    { new: true }
  )
  if(!updated) return res.status(404).json({message:"service not found"})
  res.json(updated)
})

r.delete("/:id/services/:serviceId",async(req,res)=>{
  const barber = await Barber.findById(req.params.id)
  if(!barber) return res.status(404).json({message:"barber not found"})
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
