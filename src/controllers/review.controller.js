
import Review from "../models/Review.js"

export const createReview = async(req,res)=>{
const review = await Review.create(req.body)
res.json(review)
}

export const barberReviews = async(req,res)=>{
const reviews = await Review.find({barberId:req.params.id})
res.json(reviews)
}
