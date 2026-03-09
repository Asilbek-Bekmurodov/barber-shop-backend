
import { PutObjectCommand } from "@aws-sdk/client-s3"
import crypto from "crypto"
import fs from "fs/promises"
import path from "path"
import r2, { r2Bucket, r2PublicBaseUrl } from "../config/r2.js"

export const uploadImage = async (req, res) => {
  if (!req.file) {
    return res.status(400).json({ message: "No file uploaded" })
  }

  if (!r2Bucket || !r2PublicBaseUrl) {
    return res.status(500).json({
      message: "R2 not configured. Check R2_BUCKET and R2_PUBLIC_BASE_URL.",
    })
  }

  const ext = path.extname(req.file.originalname || "")
  const key = `uploads/${crypto.randomUUID()}${ext}`

  try {
    const body = await fs.readFile(req.file.path)
    await r2.send(
      new PutObjectCommand({
        Bucket: r2Bucket,
        Key: key,
        Body: body,
        ContentType: req.file.mimetype,
      })
    )

    const url = `${r2PublicBaseUrl.replace(/\/$/, "")}/${key}`
    return res.json({ url })
  } finally {
    await fs.unlink(req.file.path).catch(() => {})
  }
}
