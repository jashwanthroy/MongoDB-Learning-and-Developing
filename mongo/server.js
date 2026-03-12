const mongoose = require("mongoose")
const app = require("./app")
const { connectRedis } = require("./config/redis")


mongoose.connect("Use Your own connection string").then(()=>{
    console.log("Connected to MongoDB");
    connectRedis();
    app.listen(3001,()=>{
        console.log("Server Running on port 3001")
    })
}).catch((err)=>{
    console.error("Database Connection Failed:",err.message);
})