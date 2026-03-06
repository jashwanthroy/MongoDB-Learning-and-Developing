const express = require("express");
const router = express.Router();
const {createUser, getUsers,getUserById,updateUserById,deleteUserById,getUserCount,getUsersByAge,getUsersAboveAge,getAvgAge,getReqFields,getUsersWithOrders,getUsersTotalSpending,getTopUsers,getOrderPerUser} = require("../controllers/user.controller")

router.post("/",createUser);
router.get("/",getUsers);

//Aggregation
router.get("/stats/count",getUserCount)
router.get("/stats/byage",getUsersByAge)
router.get("/stats/getage",getUsersAboveAge)
router.get("/stats/avg",getAvgAge)
router.get("/stats/specific",getReqFields)
//lookup (orders table)
router.get("/stats/getorders",getUsersWithOrders)
router.get("/stats/totalspent",getUsersTotalSpending)
router.get("/stats/topusers",getTopUsers)
router.get("/stats/orderperuser",getOrderPerUser)

router.get("/:id",getUserById);
router.patch("/:id",updateUserById)
router.delete("/:id",deleteUserById)

module.exports = router;