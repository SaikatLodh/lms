const Redis = require("ioredis");
const env = require("dotenv");
env.config({ path: ".env" });

const redis = new Redis(process.env.REDIS_URL);

redis.on("connect", () => console.log("Redis connected"));
redis.on("error", (err) => console.error("Redis error", err));
module.exports = redis;
