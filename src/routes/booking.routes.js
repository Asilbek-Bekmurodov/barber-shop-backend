
import express from "express"
import {createBooking,getBookings} from "../controllers/booking.controller.js"
const r=express.Router()
r.post("/",createBooking)
r.get("/",getBookings)
export default r
