const mongoose = require("mongoose")
const bcrypt = require("bcrypt")

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
    password:{
        type: String,
        required: true
    },
    age:{
        type: Number,
        min: 0
    },
    balance:{
        type: Number,
        default: 0
    }
},{timestamps: true});
userSchema.index({ email: 1},{unique: true})
userSchema.pre("save", async function(){
    if(!this.isModified("password")){
        return;
    }
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password,salt);
})
module.exports = mongoose.model("User",userSchema);