const express = require("express");
const router = express.Router();
const {createUser, getUsers,getUserById,updateUserById,deleteUserById,getUserCount,getUsersByAge,getUsersAboveAge,getAvgAge,getReqFields} = require("../controllers/user.controller")

router.post("/",createUser);
router.get("/",getUsers);
router.get("/:id",getUserById);
router.patch("/:id",updateUserById)
router.delete("/:id",deleteUserById)
//Aggregation
router.get("/stats/count",getUserCount)
router.get("/stats/byage",getUsersByAge)
router.get("/stats/getage",getUsersAboveAge)
router.get("/stats/avg",getAvgAge)
router.get("/stats/specific",getReqFields)

module.exports = router;