
import express from "express"
import {createReview,barberReviews} from "../controllers/review.controller.js"
const r=express.Router()
r.post("/",createReview)
r.get("/barber/:id",barberReviews)
export default r
