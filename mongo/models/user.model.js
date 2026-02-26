const mongoose = require("mongoose")

const userSchema = new mongoose.Schema({
    name:{
        type: String,
        required: [true,"Name is Required"],
        minlength: 3
    },
    email:{
        type: String,
        required: [true, "Email is Required"],
    },
    age:{
        type: Number,
        min: 0
    }
},{timestamps: true});
userSchema.index({ email: 1},{unique: true})
module.exports = mongoose.model("User",userSchema);