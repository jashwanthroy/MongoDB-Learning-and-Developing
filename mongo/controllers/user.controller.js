const User = require("../models/user.model");
const mongoose = require("mongoose");
const asyncHandler = require("../middleware/asyncHandler");
const CustomError = require("../utils/customError");
const jwt = require("jsonwebtoken")
const {redisClient} = require("../config/redis")
const userService = require("../services/user.service")

// User Collection
exports.createUser = asyncHandler(async (req, res, next) => {
  const { name, email,password,age,balance } = req.body; 
  console.log(req.body)
  if (!name || !email || !password) {
    return next(new CustomError("Name and Email, Password are required", 400));
  }

  const user = await User.create({
    name,
    email,
    password,
    age,
    balance
  });
  //cache invalidation Implementation
  await redisClient.del("users")
  // const user = await userService.createUser(req.body)
  res.status(201).json({
    status: "success",
    data: user,
  });
});

exports.getUsers = asyncHandler(async (req, res, next) => {
  // const queryObj = { ...req.query };

  // const excludeFields = ["page", "limit", "select"];
  // excludeFields.forEach((el) => delete queryObj[el]);

  // let query = User.find(queryObj);

  // if (req.query.select) {
  //   const fields = req.query.select.split(",").join(" ");
  //   query = query.select(fields);
  // }
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;
  const skip = (page - 1) * limit;
  const users = await User.find().skip(skip).limit(limit).lean();
  // query = query.skip(skip).limit(limit);

  // const users = await User.find();
  // // const users = await query;
  // res.status(200).json({
  //   status: "success",
  //   results: users.length,
  //   data: users,
  // });
  // const cache = await redisClient.get("users");
  //     if(cache){
  //         return res.json({
  //             source: "cache",
  //             data: JSON.parse(cache)
  //         })
  //     }
  //     const users = await User.find();
  //     await redisClient.set(
  //         "users",
  //         JSON.stringify(users),
  //         { EX: 60}
  //     )
  //     res.json({
  //         source: "database",
  //         data: users
  //     })
  // const users = await userService.getUsers();
  res.json({
    status:"success",
    page,
    results: users.length,
    data: users
  })
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
  await redisClient.del("users")
  res.status(200).json({
    status: "success",
    data: user,
  });
});

exports.deleteUserById = asyncHandler(async (req, res, next) => {
  const { id } = req.params;
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return next(new CustomError("Invalid User Id format", 400));
  }
  const user = await User.findByIdAndDelete(id);
  if (!user) {
    return next(new CustomError("User Not FOund", 404));
  }
  await redisClient.del("users")
  res.status(200).json({
    status: "success",
    message: "User Deleted Sucessfully",
  });
});

//Aggregation
//total users
exports.getUserCount = asyncHandler(async (req, res, next) => {
  const result = await User.aggregate([
    {
      $group: {
        _id: null,
        totalUsers: { $sum: 1 },
      },
    },
  ]);
  res.status(200).json({
    status: "success",
    data: result,
  });
});

//group users by age
exports.getUsersByAge = asyncHandler(async (req, res, next) => {
  const result = await User.aggregate([
    {
      $group: {
        _id: "$age",
        count: { $sum: 1 },
      },
    },
    {
      $sort: { _id: 1 },
    },
  ]);
  res.status(200).json({
    status: "success",
    data: result,
  });
});

//grouping users above age 20
exports.getUsersAboveAge = asyncHandler(async (req, res, next) => {
  const minAge = parseInt(req.query.age) || 20;
  const result = await User.aggregate([
    {
      $match: { age: { $gt: minAge } },
    },
    {
      $group: {
        _id: "$age",
        count: { $sum: 1 },
      },
    },
    {
      $sort: { _id: 1 },
    },
  ]);
  res.status(200).json({
    status: "success",
    data: result,
  });
});

//Average age of Users
exports.getAvgAge = asyncHandler(async (req, res, next) => {
  const result = await User.aggregate([
    {
      $group: {
        _id: null,
        averageAge: {
          $avg: "$age",
        },
      },
    },
  ]);
  res.status(200).json({
    status: "success",
    data: result,
  });
});
//retriving required fields
exports.getReqFields = asyncHandler(async (req, res, next) => {
  const result = await User.aggregate([
    {
      $project: {
        name: 1,
        age: 1,
        _id: 0,
        // dob: 0
      },
    },
  ]);
  res.status(200).json({
    status: "success",
    data: result,
  });
});

// $lookup users with their orders
exports.getUsersWithOrders = asyncHandler(async (req, res, next) => {
  const data = await User.aggregate([
    {
      $lookup: {
        from: "orders",
        localField: "_id",
        foreignField: "userId",
        as: "orders",
      },
    },
  ]);
  res.status(200).json({
    status: "success",
    data,
  });
});

// $addFields add orders with total price for user
exports.getUsersTotalSpending = asyncHandler(async (req, res, next) => {
  const data = await User.aggregate([
    {
      $lookup: {
        from: "orders",
        localField: "_id",
        foreignField: "userId",
        as: "orders",
      },
    },
    {
      $addFields: {
        totalSpent: { $sum: "$orders.price" },
      },
    },
  ]);
  res.status(200).json({
    status: "success",
    data,
  });
});

//top 5 users by spending
exports.getTopUsers = asyncHandler(async (req, res, next) => {
  const data = await User.aggregate([
    {
      $lookup: {
        from: "orders",
        localField: "_id",
        foreignField: "userId",
        as: "orders",
      },
    },
    {
      $addFields: {
        totalSpent: { $sum: "$orders.price" },
      },
    },
    {
      $sort: { totalSpent: -1 },
    },
    {
      $limit: 5,
    },
  ]);
  res.status(200).json({
    status: "success",
    data,
  });
});

//orders per user
exports.getOrderPerUser = asyncHandler(async (req, res, next) => {
  const data = await User.aggregate([
    {
      $lookup: {
        from: "orders",
        localField: "_id",
        foreignField: "userId",
        as: "orders",
      },
    },
    {
      $addFields: {
        orderCount: { $size: "$orders" },
      },
    },
  ]);
  res.status(200).json({
    status: "success",
    data,
  });
});

exports.searchUser = asyncHandler(async(req,res)=>{
  const {email} = req.query;
  if(!email){
    return res.status(400).json({
      message:"Email Required"
    })
  }
  const user = await User.findOne({email}).select("_id name email").lean();
  res.json({
    data: user
  })
})
//cursor pagination
exports.getUsersCursor = asyncHandler(async(req,res)=>{
  const {cursor} = req.query;
  const limit = 10;
  const query = cursor ? { _id: {$gt: cursor}} : {};
  const users = await User.find(query).sort({_id: 1}).limit(limit).lean();
  res.json({
    status:"success",
    data: users
  })
})

//Transactions
exports.transferMoney = asyncHandler(async(req,res,next)=>{
  const{ fromUId, toUId, amount } = req.body;
  //starting the sesstion
  const session = await  mongoose.startSession();
  try{
    //start transaction
    session.startTransaction();

    //fetching the users
    const fromuser = await User.findById(fromUId).session(session);
    const touser = await User.findById(toUId).session(session);
    //invalid conditions
    if(!fromuser || !touser){
      throw new Error("User Not Found");
    }
    if(fromuser.balance < amount){
      throw new Error("Insufficient Balance")
    }
    //debit sender
    fromuser.balance -= amount;
    await fromuser.save({ session })
    //credit receiver
    touser.balance += amount;
    await touser.save({ session })

    await session.commitTransaction();

    res.json({
      message: "Transaction Success!!!"
    })

  }catch(error){

    //rollback if any error
    await session.abortTransaction();
    res.status(400).json({
      message: error.message
    })
  }finally{
    session.endSession();
  }
})