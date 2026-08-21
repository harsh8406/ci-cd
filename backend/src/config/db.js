const mongoose = require("mongoose");

const connectDB = async () => {
  const mongoUri = process.env.MONGO_URI || "mongodb://localhost:27017/cicd_platform";

  try {
    await mongoose.connect(mongoUri);
    console.log(`[MongoDB] Connected: ${mongoose.connection.host}`);
  } catch (error) {
    console.error(`[MongoDB] Connection error: ${error.message}`);
    // Retry after 5 seconds instead of crashing immediately -
    // useful when Mongo container is still starting up in docker-compose
    setTimeout(connectDB, 5000);
  }
};

mongoose.connection.on("disconnected", () => {
  console.warn("[MongoDB] Disconnected. Attempting to reconnect...");
});

module.exports = connectDB;
