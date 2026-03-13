const User = require("../models/user.model")

exports.getUsers = async () =>{
    return await User.find();
}

exports.createUser = async (data) =>{
    return await User.create(data);
}

exports.deleteUser = async (id) =>{
    return await User.findByIdAndDelete(id);
}