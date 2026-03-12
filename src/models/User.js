
import mongoose from "mongoose"

const schema = new mongoose.Schema(
  {
    name: { type: String, trim: true },
    firstName: { type: String, trim: true },
    lastName: { type: String, trim: true },
    phone: { type: String, trim: true },
    age: { type: Number },
    rating: { type: Number },
    image: { type: String, trim: true },
    email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
    },
    password: { type: String, required: true },
    role: {
      type: String,
      enum: ["superadmin", "admin", "barber", "client"],
      default: "client",
    },
  },
  { timestamps: true }
)

export default mongoose.model("User",schema)
