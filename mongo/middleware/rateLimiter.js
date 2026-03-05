const rateLimit = require("express-rate-limit")


//Gloabal API limiter (Applies for entire API)
exports.apiLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 100,
    message: "Too many Requests, Try again later"
})

//Login Limiter
exports.loginLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 5,
    message: "Too many Request,Try again after 15 minutes"
})

//Password reset Limiter
exports.resetLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 3,
    message: "Too many reset Request, Try later."
})