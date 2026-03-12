import bcrypt from "bcryptjs"
import User from "../models/User.js"

export const createUser = async (req, res) => {
  const { name, email, password, role, firstName, lastName, phone, age, rating, image } = req.body
  if (!name || !email || !password) {
    return res.status(400).json({ message: "name, email, password required" })
  }
  const normalizedEmail = email.toLowerCase().trim()
  const allowedRoles = ["admin", "barber", "client"]
  const finalRole = role && allowedRoles.includes(role) ? role : "client"

  const exists = await User.findOne({ email: normalizedEmail })
  if (exists) return res.status(400).json({ message: "Email already used" })

  const hash = await bcrypt.hash(password, 10)
  const user = await User.create({
    name,
    firstName,
    lastName,
    phone,
    age,
    rating,
    image,
    email: normalizedEmail,
    password: hash,
    role: finalRole,
  })
  const safeUser = user.toObject()
  delete safeUser.password
  res.status(201).json(safeUser)
}

export const listUsers = async (req, res) => {
  const users = await User.find().select("-password")
  res.json(users)
}

export const updateUser = async (req, res) => {
  if (req.body && Object.prototype.hasOwnProperty.call(req.body, "password")) {
    return res.status(400).json({ message: "password update not allowed here" })
  }
  const updated = await User.findByIdAndUpdate(req.params.id, req.body, { new: true }).select(
    "-password"
  )
  if (!updated) return res.status(404).json({ message: "user not found" })
  res.json(updated)
}

export const deleteUser = async (req, res) => {
  const deleted = await User.findByIdAndDelete(req.params.id)
  if (!deleted) return res.status(404).json({ message: "user not found" })
  res.json({ message: "deleted" })
}
