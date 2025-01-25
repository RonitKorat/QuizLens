const mongoose = require("mongoose");

mongoose.connect(
  "mongodb+srv://ronitpatel505:9wlCWtBVaEzVk3VE@test.eq618.mongodb.net/videotoquiz",
  {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  }
);

mongoose.connection.on("connected", () => {
  console.log("Connected to MongoDB successfully");
});
  
mongoose.connection.on("error", (err) => {
  console.error("Error connecting to MongoDB:", err);
});
