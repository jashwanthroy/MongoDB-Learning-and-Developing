const Order = require("../models/order.model")
const User = require("../models/user.model")
const mongoose = require("mongoose")
const asyncHandler = require("../middleware/asyncHandler")
const CustomError = require("../utils/customError")

exports.createOrder = asyncHandler(async (req,res,next) =>{
    const session = await mongoose.startSession();
    session.startTransaction();
    try{
        const {userId, price} = req.body;
        const user = await User.findById(userId).session(session);
        if(!user){
            throw new CustomError("User Not Found!",404);
        }
        if(user.balance < price){
            throw new Error("Insufficient Balance");
        }
        user.balance -= price;
        await user.save({session});
        const order = await Order.create([
            {
                userId,
                price
            }
        ],{session})
        await session.commitTransaction();
        session.endSession();
        res.status(201).json({
            status: "success",
            data: order
        })
    }catch(error){
        await session.abortTransaction();
        session.endSession();
        next(error);
    }
    // const { userId, price} = req.body;
    // if(!userId || !price){
    //     return next(new CustomError("userId and Price both are mandatory",400))
    // }
    // if(!mongoose.Types.ObjectId.isValid(userId)){
    //     return next(new CustomError("Invalid UserId Format",400))
    // }
    // const user = await User.findById(userId)
    // if(!user){
    //     return next(new CustomError("User Not FOund",404))
    // }
    // const order = await Order.create({
    //     userId,
    //     price
    // })
    // res.status(201).json({
    //     status: "success",
    //     data: order
    // })
})