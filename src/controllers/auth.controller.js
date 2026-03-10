
import User from "../models/User.js"
import bcrypt from "bcryptjs"
import jwt from "jsonwebtoken"

export const register = async(req,res)=>{
const {name,email,password}=req.body
if(Object.prototype.hasOwnProperty.call(req.body,"role")){
return res.status(400).json({message:"role is not allowed on register"})
}
if(!name || !email || !password){
return res.status(400).json({message:"name, email, password required"})
}
const exists = await User.findOne({ email: email.toLowerCase().trim() })
if(exists) return res.status(400).json({message:"Email already used"})
const hash = await bcrypt.hash(password,10)
const user = await User.create({name,email,password:hash})
res.json(user)
}

export const login = async(req,res)=>{
const {email,password}=req.body
const user = await User.findOne({email})
if(!user) return res.status(400).json({message:"User not found"})
const match = await bcrypt.compare(password,user.password)
if(!match) return res.status(400).json({message:"Wrong password"})
const token = jwt.sign({id:user._id},process.env.JWT_SECRET)
res.json({token,user})
}
