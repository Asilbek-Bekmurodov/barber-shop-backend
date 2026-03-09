
import express from "express"
import {dashboard} from "../controllers/admin.controller.js"
const r=express.Router()
r.get("/dashboard",dashboard)
export default r
