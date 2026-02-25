const mongoose = require("mongoose")
const app = require("./app")

mongoose.connect("Use your Own Connection string").then(()=>{
    console.log("Connected to MongoDB");
    app.listen(3001,()=>{
        console.log("Server Running on port 3001")
    })
}).catch((err)=>{
    console.error("Database Connection Failed:",err.message);
})