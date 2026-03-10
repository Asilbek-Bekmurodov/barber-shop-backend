import dotenv from "dotenv"
import bcrypt from "bcryptjs"
import connectDB from "../config/db.js"
import User from "../models/User.js"

dotenv.config()

const ensureUser = async ({ name, email, password, role }) => {
  if (!email || !password) return null
  const exists = await User.findOne({ email })
  if (exists) return exists
  const hash = await bcrypt.hash(password, 10)
  return User.create({ name, email, password: hash, role })
}

const run = async () => {
  await connectDB()

  const superadmin = await ensureUser({
    name: process.env.SUPERADMIN_NAME || "Super Admin",
    email: process.env.SUPERADMIN_EMAIL,
    password: process.env.SUPERADMIN_PASSWORD,
    role: "superadmin",
  })

  const admin = await ensureUser({
    name: process.env.ADMIN_NAME || "Admin",
    email: process.env.ADMIN_EMAIL,
    password: process.env.ADMIN_PASSWORD,
    role: "admin",
  })

  console.log("Seed complete", {
    superadmin: superadmin ? superadmin.email : null,
    admin: admin ? admin.email : null,
  })
  process.exit(0)
}

run().catch((err) => {
  console.error(err)
  process.exit(1)
})
