const Order = require("../models/order.model")
const User = require("../models/user.model")
const mongoose = require("mongoose")
const asyncHandler = require("../middleware/asyncHandler")
const CustomError = require("../utils/customError")

exports.createOrder = asyncHandler(async (req,res,next) =>{
    const { userId, price} = req.body;
    if(!userId || !price){
        return next(new CustomError("userId and Price both are mandatory",400))
    }
    if(!mongoose.Types.ObjectId.isValid(userId)){
        return next(new CustomError("Invalid UserId Format",400))
    }
    const user = await User.findById(userId)
    if(!user){
        return next(new CustomError("User Not FOund",404))
    }
    const order = await Order.create({
        userId,
        price
    })
    res.status(201).json({
        status: "success",
        data: order
    })
})