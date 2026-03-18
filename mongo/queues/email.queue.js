const {Queue} = require("bullmq");
const emailQueue = new Queue("emailQueue",{
    connections:{
        hosts: "Ip",
        port: port_number
    }
})
module.exports = emailQueue;