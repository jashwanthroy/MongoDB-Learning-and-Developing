const express = require("express")
const app = express()
const userRoutes = require("../mongo/routes/user.routes")
const orderRoutes = require("../mongo/routes/order.routes")
const errorMiddleware = require("../mongo/middleware/error.middleware")

app.use((req,res,next)=>{
    console.log("request reached Express",req.method,req.url);
    next()
})
app.use(express.json())
app.use("/api/users",userRoutes)
app.use("/api/orders",orderRoutes)
app.use(errorMiddleware)

module.exports = app;