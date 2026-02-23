const express = require("express");
const router = express.Router();
const {createUser, getUsers,getUserById} = require("../controllers/user.controller")

router.post("/",createUser);
router.get("/",getUsers);
router.get("/:id",getUserById);

module.exports = router;