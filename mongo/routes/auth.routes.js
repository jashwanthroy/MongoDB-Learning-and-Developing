const express = require("express")
const router = express.Router();

const { register, login } = require("../controllers/auth.controller")
const { protect } = require("../middleware/protect")

router.post("/register",register)

router.post("/login", login)

router.get("/me", protect, (req,res)=>{
    res.json({
        message: "User Profile fetched Successfully",
        user: req.user
    })
})

module.exports = router;