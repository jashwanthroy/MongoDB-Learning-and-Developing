const jwt = require("jsonwebtoken")
const User = require("../models/user.model")
const asyncHandler = require("../middleware/asyncHandler")
const CustomError = require("../utils/customError")
exports.protect = asyncHandler(async (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    token = req.headers.authorization.split(" ")[1];
  }

  if (!token) {
    throw new CustomError("Not Authorized", 401);
  }

  const decoded = jwt.verify(token, process.env.JWT_SECRET);
  req.user = await User.findById(decoded.id);

  next();
});