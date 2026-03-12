
import { PutObjectCommand, DeleteObjectCommand } from "@aws-sdk/client-s3"
import crypto from "crypto"
import fs from "fs/promises"
import path from "path"
import r2, { r2Bucket, r2PublicBaseUrl } from "../config/r2.js"

export const uploadFileToR2 = async (file) => {
  if (!r2Bucket || !r2PublicBaseUrl) {
    throw new Error("R2 not configured")
  }

  const ext = path.extname(file.originalname || "")
  const key = `uploads/${crypto.randomUUID()}${ext}`

  try {
    const body = await fs.readFile(file.path)
    await r2.send(
      new PutObjectCommand({
        Bucket: r2Bucket,
        Key: key,
        Body: body,
        ContentType: file.mimetype,
      })
    )

    const url = `${r2PublicBaseUrl.replace(/\/$/, "")}/${key}`
    return url
  } finally {
    await fs.unlink(file.path).catch(() => {})
  }
}

export const uploadImage = async (req, res) => {
  if (!req.file) {
    return res.status(400).json({ message: "No file uploaded" })
  }

  if (!r2Bucket || !r2PublicBaseUrl) {
    return res.status(500).json({
      message: "R2 not configured. Check R2_BUCKET and R2_PUBLIC_BASE_URL.",
    })
  }

  try {
    const url = await uploadFileToR2(req.file)
    return res.json({ url })
  } catch (err) {
    return res.status(500).json({ message: "Upload failed" })
  }
}

const extractKeyFromUrl = (url) => {
  try {
    const base = r2PublicBaseUrl ? r2PublicBaseUrl.replace(/\/$/, "") : ""
    if (base && url.startsWith(base)) {
      return url.slice(base.length + 1)
    }
    const u = new URL(url)
    return u.pathname.replace(/^\/+/, "")
  } catch {
    return null
  }
}

export const deleteImage = async (req, res) => {
  if (!r2Bucket) {
    return res.status(500).json({
      message: "R2 not configured. Check R2_BUCKET.",
    })
  }

  const { key, url } = req.body || {}
  const finalKey = key || (url ? extractKeyFromUrl(url) : null)
  if (!finalKey) {
    return res.status(400).json({ message: "key or url required" })
  }

  try {
    await r2.send(
      new DeleteObjectCommand({
        Bucket: r2Bucket,
        Key: finalKey,
      })
    )
    return res.json({ message: "deleted", key: finalKey })
  } catch (err) {
    return res.status(500).json({ message: "Delete failed" })
  }
}
