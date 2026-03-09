
import express from "express"
import multer from "multer"
import {uploadImage} from "../controllers/upload.controller.js"

const upload = multer({dest:"uploads/"})
const r=express.Router()

r.post("/",upload.single("image"),uploadImage)

export default r
