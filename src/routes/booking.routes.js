
import express from "express"
import {createBooking,getBookings,updateBooking,deleteBooking} from "../controllers/booking.controller.js"
const r=express.Router()
r.post("/",createBooking)
r.get("/",getBookings)
r.put("/:id",updateBooking)
r.delete("/:id",deleteBooking)
export default r
