import jwt from "jsonwebtoken"
import User from "../models/User.js"

export const requireAuth = async (req, res, next) => {
  try {
    const header = req.headers.authorization || ""
    const [scheme, token] = header.split(" ")
    if (scheme !== "Bearer" || !token) {
      return res.status(401).json({ message: "Unauthorized" })
    }
    const payload = jwt.verify(token, process.env.JWT_SECRET)
    const user = await User.findById(payload.id)
    if (!user) return res.status(401).json({ message: "Unauthorized" })
    req.user = user
    next()
  } catch (err) {
    return res.status(401).json({ message: "Unauthorized" })
  }
}
