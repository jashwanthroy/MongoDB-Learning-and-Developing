const asyncHandler = require("../middleware/asyncHandler")
const emailQueue = require("../queues/email.queue")

exports.sendEmail = asyncHandler(async(req,res) =>{
    const {to, subject} = req.body;
    console.log("Sending Job:",{to,subject})
    await emailQueue.add("sendEmail",{
        to,
        subject
    },{
        attempts: 3,
        delay: 5000
    })
    res.json({
        message: "Email Job added to Queue"
    })
})