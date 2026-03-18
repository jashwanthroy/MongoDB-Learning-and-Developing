const {Worker} = require("bullmq");

const worker = new Worker(
    "emailQueue",
    async(job)=>{
        console.log("Processing Job:",job.data);
        await new Promise(resolve => setTimeout(resolve, 3000));
        console.log(`Email send to ${job.data.to}`);
    },
    {
        connection:{
            host: "Ip",
            port: portnumber
        }
    }
)