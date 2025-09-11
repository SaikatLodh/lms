const Redis = require("ioredis");
const env = require("dotenv");
env.config({ path: ".env" });

const redis = new Redis(process.env.REDIS_URL, {
  tls: {
    rejectUnauthorized: false,
  },
});

module.exports = redis;
