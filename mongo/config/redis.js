const {createClient} = require("redis")

const redisClient = createClient({
    url: "use your own client url"
})

redisClient.on("connect",()=>{
    console.log("Redis Connected");
})

redisClient.on("error",(err)=>{
    console.error("Redis Error",err)
})

async function connectRedis(){
    await redisClient.connect();
}

module.exports = {redisClient,connectRedis}