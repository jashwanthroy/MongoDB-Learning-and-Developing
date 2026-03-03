//JWT And Security
//register user
const User = require("../models/user.model")
const jwt = require("jsonwebtoken")
const bcrypt = require("bcrypt")
const asyncHandler = require("../middleware/asyncHandler")
// const CustomError = require("../utils/customError")

exports.register = asyncHandler(async (req, res) => {
  const { name, email, password } = req.body;
  console.log(typeof asyncHandler)
  const user = await User.create({
    name,
    email,
    password,
  });
  res.status(201).json({
    status: "user register successfully",
  });
});


//login user
exports.login = asyncHandler(async(req,res)=>{
  const {email,password} = req.body;
  const user = await User.findOne({ email });
  if(!user){
    // throw new CustomError("Invalid Credentials",404);
    throw new Error("Not Authorized");
  }
  const isMatch = await bcrypt.compare(password,user.password);
  if(!isMatch){
    throw new Error("Not Authorized");
    // throw new CustomError("Invalid Credentials",404);
  }

  // const token = jwt.sign(
  //   {id: user._id},
  //   "jaswanth2912#",
  //   {expiresIn: "1h"}
  // )
  const accessToken = jwt.sign(
    {id: user._id},
    "accesssec123#",
    {expiresIn: "10m"}
  )
  const refreshToken = jwt.sign(
    {id: user._id},
    "refressec123#",
    { expiresIn: "7d"}
  )
  res.status(200).json({
    status: "success",
    accessToken,
    refreshToken
  })
})