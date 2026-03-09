
import express from "express"
import cors from "cors"
import dotenv from "dotenv"
import http from "http"
import { Server } from "socket.io"
import connectDB from "./src/config/db.js"
import swaggerUi from "swagger-ui-express"
import swaggerSpec from "./src/config/swagger.js"

import authRoutes from "./src/routes/auth.routes.js"
import barberRoutes from "./src/routes/barber.routes.js"
import bookingRoutes from "./src/routes/booking.routes.js"
import serviceRoutes from "./src/routes/service.routes.js"
import reviewRoutes from "./src/routes/review.routes.js"
import adminRoutes from "./src/routes/admin.routes.js"
import uploadRoutes from "./src/routes/upload.routes.js"

dotenv.config()

const app = express()
const server = http.createServer(app)
const corsOptions = {
  origin: process.env.CORS_ORIGIN || "*",
  credentials: true,
}

const io = new Server(server, { cors: corsOptions })

app.use(cors(corsOptions))
app.use(express.json())

app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec))

connectDB()

app.set("io", io)

app.use("/api/auth",authRoutes)
app.use("/api/barbers",barberRoutes)
app.use("/api/bookings",bookingRoutes)
app.use("/api/services",serviceRoutes)
app.use("/api/reviews",reviewRoutes)
app.use("/api/admin",adminRoutes)
app.use("/api/upload",uploadRoutes)

app.get("/", (req, res) => {
  res.send("https://barber-shop-backend-zoxv.onrender.com/")
})

io.on("connection",(socket)=>{
console.log("socket connected")
})

const PORT = process.env.PORT || 5001

server.listen(PORT, () => {
  console.log(`backend ishlayapti: ${PORT}`)
})
