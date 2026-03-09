
import User from "../models/User.js"
import Booking from "../models/Booking.js"
import Barber from "../models/Barber.js"

export const dashboard = async(req,res)=>{
const users = await User.countDocuments()
const bookings = await Booking.countDocuments()
const barbers = await Barber.countDocuments()

res.json({users,bookings,barbers})
}
