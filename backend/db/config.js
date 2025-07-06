const mongoose = require("mongoose");

// Try to load dotenv if available
try {
  require("dotenv").config();
} catch (error) {
  console.log("dotenv not available, using default configuration");
}

// Use environment variable or fallback to local MongoDB
const url = process.env.MONGO_URL || "mongodb://localhost:27017/videotoquiz";

console.log("Attempting to connect to MongoDB at:", url);

mongoose.connect(url, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

mongoose.connection.on("connected", () => {
  console.log("✅ Connected to MongoDB successfully");
  console.log("Database:", mongoose.connection.name);
});

mongoose.connection.on("error", (err) => {
  console.error("❌ Error connecting to MongoDB:", err);
});

mongoose.connection.on("disconnected", () => {
  console.log("📡 MongoDB disconnected");
});

// Handle process termination
process.on('SIGINT', async () => {
  await mongoose.connection.close();
  console.log('MongoDB connection closed through app termination');
  process.exit(0);
});
