const Redis = require("ioredis");
const env = require("dotenv");
env.config({ path: ".env" });

const redis = new Redis(process.env.REDIS_URL, {
  tls: {
    rejectUnauthorized: false,
  },
  lazyConnect: true,
  maxRetriesPerRequest: 3, // Limit retries to prevent infinite loops
  enableReadyCheck: true,
  connectTimeout: 30000, // Increase to 30 seconds
  commandTimeout: 5000, // Add command timeout
  retryStrategy(times) {
    const delay = Math.min(times * 100, 5000); // Slower, longer max delay
    console.log(`Redis retry attempt ${times}, delay: ${delay}ms`);
    return delay;
  },
  retryDelayOnFailover: 1000,
  retryDelayOnClusterDown: 1000,
  retryDelayOnTryAgain: 1000,
  // Add connection pool settings
  maxRetriesPerRequest: 3,
  enableOfflineQueue: false, // Disable offline queue to fail fast
});

// Enhanced error handling
redis.on("connect", () => {
  console.log("Redis client connecting...");
});

redis.on("ready", () => {
  console.log("Redis client connected and ready.");
});

redis.on("error", (err) => {
  console.error("Redis error:", err.message);
  // Don't exit process, let the app handle gracefully
});

redis.on("close", () => {
  console.log("Redis connection closed.");
});

redis.on("reconnecting", (delay) => {
  console.log(`Redis reconnecting in ${delay}ms...`);
});

// Graceful connection with error handling
redis.connect().catch((err) => {
  console.error("Redis initial connection failed:", err.message);
  console.log("Application will continue without Redis caching");
});

module.exports = redis;
