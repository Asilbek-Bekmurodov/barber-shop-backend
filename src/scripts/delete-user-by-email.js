import dotenv from "dotenv"
import connectDB from "../config/db.js"
import User from "../models/User.js"

dotenv.config()

const run = async () => {
  const email = (process.env.ADMIN_EMAIL || "").toLowerCase().trim()
  if (!email) {
    throw new Error("ADMIN_EMAIL must be set")
  }

  await connectDB()
  const result = await User.deleteOne({ email })
  console.log("Delete result for", email, result)
  process.exit(0)
}

run().catch((err) => {
  console.error(err)
  process.exit(1)
})
