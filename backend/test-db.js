const mongoose = require("mongoose");

// Test database connection
async function testConnection() {
  try {
    console.log("Testing MongoDB connection...");
    
    // Try to connect
    await mongoose.connect("mongodb://localhost:27017/videotoquiz", {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    
    console.log("✅ Successfully connected to MongoDB!");
    console.log("Database:", mongoose.connection.name);
    
    // Test creating a collection
    const testCollection = mongoose.connection.collection('test');
    await testCollection.insertOne({ test: "data", timestamp: new Date() });
    console.log("✅ Successfully wrote to database!");
    
    // Clean up test data
    await testCollection.deleteOne({ test: "data" });
    console.log("✅ Successfully cleaned up test data!");
    
    await mongoose.connection.close();
    console.log("✅ Database connection closed successfully!");
    
  } catch (error) {
    console.error("❌ Database connection failed:", error.message);
    console.log("\nPossible solutions:");
    console.log("1. Make sure MongoDB is installed and running");
    console.log("2. Start MongoDB service: sudo systemctl start mongod");
    console.log("3. Or install MongoDB Community Edition");
    console.log("4. Check if port 27017 is available");
  }
}

testConnection(); 