const userRepo = require("../repositories/user.repository");
const {redisClient} = require("../config/redis");
const asyncHandler = require("../middleware/asyncHandler");

exports.getUsers = async () =>{
    const cache = await redisClient.get("users:list");
    if(cache){
        return JSON.parse(cache);
    }
    const users = await userRepo.getUsers();
    await redisClient.set("user:list",
        JSON.stringify(users),
        {EX: 60}
    )
    return users;
}

exports.createUser = asyncHandler(async(req,res,next) =>{
    const {name,email,password,age} = req.body;
    if (!name || !email || !password) {
    return next(new CustomError("Name and Email, Password are required", 400));
  }
  const user = await userRepo.createUser({name,email,password,age})
  await redisClient.del("users:list");
}) 