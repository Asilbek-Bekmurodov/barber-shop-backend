
import User from "../models/User.js"
import bcrypt from "bcryptjs"
import jwt from "jsonwebtoken"

export const register = async(req,res)=>{
const {name,email,password,firstName,lastName,phone,age,rating,image}=req.body
if(Object.prototype.hasOwnProperty.call(req.body,"role")){
return res.status(400).json({message:"role is not allowed on register"})
}
if(!name || !email || !password){
return res.status(400).json({message:"name, email, password required"})
}
const normalizedEmail = email.toLowerCase().trim()
const exists = await User.findOne({ email: normalizedEmail })
if(exists) return res.status(400).json({message:"Email already used"})
const hash = await bcrypt.hash(password,10)
const user = await User.create({
name,
firstName,
lastName,
phone,
age,
rating,
image,
email: normalizedEmail,
password:hash
})
const safeUser = user.toObject()
delete safeUser.password
res.json(safeUser)
}

export const login = async(req,res)=>{
const {email,password}=req.body
const normalizedEmail = (email || "").toLowerCase().trim()
const user = await User.findOne({email: normalizedEmail})
if(!user) return res.status(400).json({message:"User not found"})
const match = await bcrypt.compare(password,user.password)
if(!match) return res.status(400).json({message:"Wrong password"})
const token = jwt.sign({id:user._id},process.env.JWT_SECRET)
const safeUser = user.toObject()
delete safeUser.password
res.json({token,user:safeUser})
}
