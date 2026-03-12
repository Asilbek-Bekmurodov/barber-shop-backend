
import express from "express"
import multer from "multer"
import {uploadImage, deleteImage} from "../controllers/upload.controller.js"

const upload = multer({dest:"uploads/"})
const r=express.Router()

r.post("/",upload.single("image"),uploadImage)
r.delete("/",deleteImage)

export default r
