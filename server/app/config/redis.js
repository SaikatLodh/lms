const Redis = require("ioredis");
const env = require("dotenv");
env.config({ path: ".env" });

const redis = new Redis(process.env.REDIS_URL, {
  tls: {
    rejectUnauthorized: false,
  },
  lazyConnect: true,
  maxRetriesPerRequest: null,
  enableReadyCheck: true,
  connectTimeout: 10000,
  retryStrategy(times) {
    const delay = Math.min(times * 50, 2000);
    return delay;
  },
  retryDelayOnFailover: 1000,
  retryDelayOnClusterDown: 1000,
  retryDelayOnTryAgain: 1000,
});

redis.on("connect", () => {
  console.log("Redis client connecting...");
});

redis.on("ready", () => {
  console.log("Redis client connected and ready.");
});

redis.on("error", (err) => {
  console.error("Redis error:", err);
});

redis.on("close", () => {
  console.log("Redis connection closed.");
});

redis.on("reconnecting", (delay) => {
  console.log(`Redis reconnecting in ${delay}ms...`);
});

redis.connect().catch((err) => {
  console.error("Redis initial connection error:", err);
});

module.exports = redis;
