const express = require("express")
const router = express.Router();

const {transferMoney} = require("../controllers/user.controller")

router.post("/transfer",transferMoney)
module.exports = router;