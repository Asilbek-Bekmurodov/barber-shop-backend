import dotenv from "dotenv"
import bcrypt from "bcryptjs"
import connectDB from "../config/db.js"
import User from "../models/User.js"

dotenv.config()

const run = async () => {
  const email = (process.env.ADMIN_EMAIL || "").toLowerCase().trim()
  const password = process.env.ADMIN_PASSWORD || ""

  if (!email || !password) {
    throw new Error("ADMIN_EMAIL and ADMIN_PASSWORD must be set")
  }

  await connectDB()

  const user = await User.findOne({ email })
  if (!user) {
    throw new Error(`User not found for email: ${email}`)
  }

  const hash = await bcrypt.hash(password, 10)
  user.password = hash
  await user.save()

  console.log("Admin password reset for", user.email)
  process.exit(0)
}

run().catch((err) => {
  console.error(err)
  process.exit(1)
})
