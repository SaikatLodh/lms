const mongoose = require("mongoose");
const dbName = require("./constants");

const connectDB = async () => {
  try {
    const connection = await mongoose.connect(
      process.env.MONGODB_URL + "/" + dbName
    );
    console.log(`MongoDB Connected: ${connection.connection.host}`);
  } catch (error) {
    console.log(error);
    process.exit(1);
  }
};

module.exports = connectDB;
