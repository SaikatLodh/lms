const Redis = require("ioredis");
const env = require("dotenv");
env.config({ path: ".env" });

const redis = new Redis({
  host: process.env.REDIS_HOST,
  port: process.env.REDIS_PORT,
  username: process.env.REDIS_USERNAME,
  password: process.env.REDIS_PASSWORD,
});

redis.on("error", (error) => console.error(error));

redis.on("connect", () => console.log("Redis connected"));

redis.on("disconnect", () => console.log("Redis disconnected"));

redis.on("reconnecting", () => console.log("Redis reconnecting"));

redis.on("end", () => console.log("Redis connection closed"));

redis.on("close", () => console.log("Redis connection closed"));

module.exports = redis;
