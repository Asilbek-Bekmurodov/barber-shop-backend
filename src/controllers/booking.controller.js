
import Booking from "../models/Booking.js"

export const createBooking = async(req,res)=>{
const {barberId,date,startTime}=req.body

const exists = await Booking.findOne({barberId,date,startTime})
if(exists) return res.status(400).json({message:"slot already booked"})

const booking = await Booking.create(req.body)

const io = req.app.get("io")
io.emit("new_booking",booking)

res.json(booking)
}

export const getBookings = async(req,res)=>{
const data = await Booking.find().populate("barberId serviceId userId")
res.json(data)
}

export const updateBooking = async(req,res)=>{
const updated = await Booking.findByIdAndUpdate(req.params.id, req.body, { new: true })
if(!updated) return res.status(404).json({message:"booking not found"})
res.json(updated)
}

export const deleteBooking = async(req,res)=>{
const deleted = await Booking.findByIdAndDelete(req.params.id)
if(!deleted) return res.status(404).json({message:"booking not found"})
res.json({message:"deleted"})
}
