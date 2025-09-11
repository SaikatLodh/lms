const Redis = require("ioredis");
const env = require("dotenv");
env.config({ path: ".env" });

const redis = new Redis(process.env.REDIS_URL, {
  tls: {
    rejectUnauthorized: false,
  },
  // Connection timeout settings
  connectTimeout: 60000, // 60 seconds
  commandTimeout: 5000, // 5 seconds
  lazyConnect: true, // Connect only when needed
  keepAlive: 30000, // Keep connection alive for 30 seconds

  // Retry configuration
  retryDelayOnFailover: 100, // Initial retry delay
  maxRetriesPerRequest: 3, // Maximum retries per request
  retryDelayOnClusterDown: 1000, // Delay when cluster is down
  enableOfflineQueue: true, // Queue commands when offline

  // Reconnection settings
  reconnectOnError: (err) => {
    console.log("Redis reconnect on error:", err.message);
    return err.message.includes("ETIMEDOUT") || err.message.includes("ECONNREFUSED");
  },
  maxRetriesPerRequest: null, // Unlimited retries for connection

  // Logging and debugging
  showFriendlyErrorStack: true,
});

redis.on("error", (err) => {
  console.error("Redis connection error:", err.message);
  if (err.code === "ETIMEDOUT") {
    console.error("Redis connection timed out. Check network connectivity and Redis server status.");
  }
});

redis.on("connect", () => {
  console.log("Successfully connected to Redis");
});

redis.on("ready", () => {
  console.log("Redis client ready to receive commands");
});

redis.on("close", () => {
  console.log("Redis connection closed");
});

redis.on("reconnecting", (delay) => {
  console.log(`Redis reconnecting in ${delay}ms`);
});

module.exports = redis;
