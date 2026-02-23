const User = require("../models/user.model")
const asyncHandler = require("../middleware/asyncHandler")
const CustomError = require("../utils/customError")

exports.createUser = asyncHandler(async (req,res,next) =>{
    const {name,email,age} = req.body;
    if(!name || !email){
        return next(new CustomError("Name and Email are required",400));
    }

    const user = await User.create({
        name,
        email,
        age
    });

    res.status(201).json({
        status: "success",
        data: user
    })
})

exports.getUsers = asyncHandler( async (req,res,next) =>{
    const queryObj = {... req.query};

    const excludeFields = ["page","limit","select"];
    excludeFields.forEach(el => delete queryObj[el]);

    let query = User.find(queryObj);

    if(req.query.select){
        const fields = req.query.select.split(",").join(" ");
        query = query.select(fields);
    }
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    query = query.skip(skip).limit(limit)

    // const users = await User.find();
    const users = await query;
    res.status(200).json({
        status: "success",
        results: users.length,
        data: users
    })
})

exports.getUserById = asyncHandler(async (req,res,next)=>{
    const user = await User.findById(req.params.id);
    if(!user){
        return next(new CustomError("User Not Found",404));
    }
    res.status(200).json({
        status: "success",
        data: user
    })
})