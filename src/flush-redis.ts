import redis from "./utils/redis";
(async function(){
    await redis.flushAll();
    console.log("Flushed redis cache")
}());

