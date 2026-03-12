
import Review from "../models/Review.js"
import User from "../models/User.js"

export const createReview = async(req,res)=>{
const payload = {...req.body}
if(payload.userId && (!payload.userName || !payload.userEmail)){
  const user = await User.findById(payload.userId).select("name firstName lastName email")
  if(user){
    const fullName = user.name || `${user.firstName||""} ${user.lastName||""}`.trim()
    if(!payload.userName) payload.userName = fullName || undefined
    if(!payload.userEmail) payload.userEmail = user.email
  }
}
const review = await Review.create(payload)
res.json(review)
}

export const barberReviews = async(req,res)=>{
const reviews = await Review.find({barberId:req.params.id})
  .populate("userId","name firstName lastName email image role")
res.json(reviews)
}
