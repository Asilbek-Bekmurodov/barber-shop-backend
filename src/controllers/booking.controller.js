
import mongoose from "mongoose"
import Booking from "../models/Booking.js"

const objectIdFields = ["userId", "barberId", "serviceId"]

const normalizeBookingPayload = (payload = {}) => {
  const normalized = { ...payload }

  for (const field of objectIdFields) {
    if (!Object.prototype.hasOwnProperty.call(normalized, field)) continue

    const value = normalized[field]
    if (value === "") {
      delete normalized[field]
      continue
    }

    if (value != null && !mongoose.isValidObjectId(value)) {
      return { error: `${field} must be a valid ObjectId` }
    }
  }

  return { data: normalized }
}

export const createBooking = async(req,res)=>{
const { data, error } = normalizeBookingPayload(req.body)
if(error) return res.status(400).json({message:error})

const {barberId,date,startTime}=data
if(!barberId || !date || !startTime){
return res.status(400).json({message:"barberId, date, startTime required"})
}

const exists = await Booking.findOne({barberId,date,startTime})
if(exists) return res.status(400).json({message:"slot already booked"})

const booking = await Booking.create(data)

const io = req.app.get("io")
io.emit("new_booking",booking)

res.json(booking)
}

export const getBookings = async(req,res)=>{
const data = await Booking.find().populate("barberId serviceId userId")
res.json(data)
}

export const updateBooking = async(req,res)=>{
if(!mongoose.isValidObjectId(req.params.id)){
return res.status(400).json({message:"booking id must be a valid ObjectId"})
}

const { data, error } = normalizeBookingPayload(req.body)
if(error) return res.status(400).json({message:error})

const updated = await Booking.findByIdAndUpdate(req.params.id, data, { new: true, runValidators: true })
if(!updated) return res.status(404).json({message:"booking not found"})
res.json(updated)
}

export const deleteBooking = async(req,res)=>{
if(!mongoose.isValidObjectId(req.params.id)){
return res.status(400).json({message:"booking id must be a valid ObjectId"})
}

const deleted = await Booking.findByIdAndDelete(req.params.id)
if(!deleted) return res.status(404).json({message:"booking not found"})
res.json({message:"deleted"})
}
