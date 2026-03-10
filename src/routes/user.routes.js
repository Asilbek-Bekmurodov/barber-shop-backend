import { Router } from "express"
import { createUser } from "../controllers/user.controller.js"
import { requireAuth } from "../middleware/auth.js"
import { requireRole } from "../middleware/requireRole.js"

const r = Router()

// Only superadmin can create users
r.post("/", requireAuth, requireRole("superadmin"), createUser)

export default r
