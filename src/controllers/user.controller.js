import bcrypt from "bcryptjs"
import User from "../models/User.js"

export const createUser = async (req, res) => {
  const { name, email, password, role } = req.body
  if (!name || !email || !password) {
    return res.status(400).json({ message: "name, email, password required" })
  }
  const allowedRoles = ["admin", "barber", "client"]
  const finalRole = role && allowedRoles.includes(role) ? role : "client"

  const exists = await User.findOne({ email })
  if (exists) return res.status(400).json({ message: "Email already used" })

  const hash = await bcrypt.hash(password, 10)
  const user = await User.create({ name, email, password: hash, role: finalRole })
  res.status(201).json({ id: user._id, name: user.name, email: user.email, role: user.role })
}
