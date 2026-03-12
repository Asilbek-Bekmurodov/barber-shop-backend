import { Router } from "express"
import multer from "multer"
import { createUser, listUsers, updateUser, deleteUser } from "../controllers/user.controller.js"
import { uploadFileToR2 } from "../controllers/upload.controller.js"
import { requireAuth } from "../middleware/auth.js"
import { requireRole } from "../middleware/requireRole.js"
import User from "../models/User.js"

const r = Router()
const upload = multer({ dest: "uploads/" })

// Only superadmin can create users
r.post("/", requireAuth, requireRole("superadmin"), createUser)
r.get("/", requireAuth, requireRole("superadmin"), listUsers)
r.put("/:id", requireAuth, requireRole("superadmin"), updateUser)
r.delete("/:id", requireAuth, requireRole("superadmin"), deleteUser)

r.post("/:id/photo", requireAuth, upload.single("image"), async (req, res) => {
  if (!req.file) return res.status(400).json({ message: "No file uploaded" })

  const user = await User.findById(req.params.id)
  if (!user) return res.status(404).json({ message: "user not found" })

  try {
    const url = await uploadFileToR2(req.file)
    user.image = url
    await user.save()
    return res.json({ url, user })
  } catch (err) {
    return res.status(500).json({ message: "Upload failed" })
  }
})

export default r
