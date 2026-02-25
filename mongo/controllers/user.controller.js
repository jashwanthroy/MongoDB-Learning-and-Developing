const User = require("../models/user.model");
const mongoose = require("mongoose")
const asyncHandler = require("../middleware/asyncHandler");
const CustomError = require("../utils/customError");

exports.createUser = asyncHandler(async (req, res, next) => {
  const { name, email, age } = req.body;
  if (!name || !email) {
    return next(new CustomError("Name and Email are required", 400));
  }

  const user = await User.create({
    name,
    email,
    age,
  });

  res.status(201).json({
    status: "success",
    data: user,
  });
});

exports.getUsers = asyncHandler(async (req, res, next) => {
  const queryObj = { ...req.query };

  const excludeFields = ["page", "limit", "select"];
  excludeFields.forEach((el) => delete queryObj[el]);

  let query = User.find(queryObj);

  if (req.query.select) {
    const fields = req.query.select.split(",").join(" ");
    query = query.select(fields);
  }
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;
  const skip = (page - 1) * limit;

  query = query.skip(skip).limit(limit);

  // const users = await User.find();
  const users = await query;
  res.status(200).json({
    status: "success",
    results: users.length,
    data: users,
  });
});

exports.getUserById = asyncHandler(async (req, res, next) => {
  const user = await User.findById(req.params.id);
  if (!user) {
    return next(new CustomError("User Not Found", 404));
  }
  res.status(200).json({
    status: "success",
    data: user,
  });
});

exports.updateUserById = asyncHandler(async (req, res, next) => {
  const { id } = req.params;
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return next(new CustomError("Invalid User Id format", 400));
  }
  const user = await User.findByIdAndUpdate(id, req.body, {
    returnDocument: after,
    runValidators: true,
  }).select("-password");
  if (!user) {
    return next(new CustomError("User Not Found", 404));
  }
  res.status(200).json({
    status: "success",
    data: user,
  });
});


exports.deleteUserById = asyncHandler(async (req,res,next) =>{
    const {id} = req.params;
    if(!mongoose.Types.ObjectId.isValid(id)){
        return next(new CustomError("Invalid User Id format",400));
    }
    const user = await User.deleteUserById(id);
    if(!user){
        return next(new CustomError("User Not FOund",404))
    }
    res.status(200).json({
        status: "success",
        message: "User Deleted Sucessfully"
    })
})

//Aggregation
//total users
exports.getUserCount = asyncHandler(async (req,res,next) =>{
    const result = await User.aggregate([
      {
        $group:{
          _id: null,
          totalUsers: { $sum : 1}
        }
      }
    ])
    res.status(200).json({
      status: "success",
      data: result
    })
})

//group users by age
exports.getUsersByAge = asyncHandler(async (req,res,next) =>{
  const result = await User.aggregate([
    {
      $group:{
        _id: "$age",
        count: { $sum: 1}
      }
    },
    {
      $sort: {_id: 1}
    }
  ])
  res.status(200).json({
    status: "success",
    data: result
  })
})

//grouping users above age 20
exports.getUsersAboveAge = asyncHandler(async (req,res,next) =>{
  const minAge = parseInt(req.query.age) || 20;
  const result = await User.aggregate([
    {
      $match: { age: { $gt: minAge}}
    },
    {
      $group:{
        _id: "$age",
        count: { $sum : 1}
      }
    },
    {
      $sort: { _id: 1 }
    }
  ])
  res.status(200).json({
    status: "success",
    data: result
  })
})

//Average age of Users
exports.getAvgAge = asyncHandler(async (req,res,next) =>{
  const result = await User.aggregate([
    {
      $group: {
        _id: null,
        averageAge: {
          $avg: "$age"
        }
      }
    }
  ])
  res.status(200).json({
    status: "success",
    data: result
  })
})
//retriving required fields
exports.getReqFields = asyncHandler(async (req,res,next) =>{
  const result = await User.aggregate([
    {
      $project: {
        name: 1,
        age: 1,
        _id: 0
        // dob: 0
      }
    }
  ])
  res.status(200).json({
    status: "success",
    data: result
  })
})