import { createClient } from "redis";
import { env } from 'process'

const redis = createClient({
    url: env.REDIS_URL ,
});
(async function () {
    redis.connect();
    console.log("⚡ Redis connected successfully!")
}());

export default redis;