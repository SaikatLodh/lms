const connectDB = require("./app/config/db");
const server = require("./app/app");
const redis = require("./app/config/redis");

const PORT = process.env.PORT || 5000;

connectDB()
  .then(() => {
    server.listen(PORT, () => console.log(`Server is running on port ${PORT}`));
  })
  .catch((err) => console.log(err));

redis.on("error", (err) => console.log(err));
redis.on("connect", () => console.log("Redis connected"));
redis.on("close", () => console.log("Redis connection closed"));
redis.on("end", () => console.log("Redis connection ended"));
