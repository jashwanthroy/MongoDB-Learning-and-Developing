require("dotenv").config()
const express = require("express")
const app = express()
const userRoutes = require("../mongo/routes/user.routes")
const orderRoutes = require("../mongo/routes/order.routes")
const authRoutes = require("../mongo/routes/auth.routes")
const errorMiddleware = require("../mongo/middleware/error.middleware")
const { apiLimiter } = require("./middleware/rateLimiter")
const mongoSanitize = require("express-mongo-sanitize")
const xss = require("xss-clean")
const hpp = require("hpp")

app.use((req,res,next)=>{
    console.log("request reached Express",req.method,req.url);
    next()
})
app.use(express.json())
app.use(mongoSanitize())
app.use(xss())
app.use(hpp())


app.use("/api",apiLimiter)
app.use("/api/users",userRoutes)
app.use("/api/orders",orderRoutes)
app.use("/api/auth",authRoutes)
app.use(errorMiddleware)

module.exports = app;