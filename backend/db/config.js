const mongoose = require("mongoose");

mongoose.connect(
  "mongodb+srv://ronitpatel505:Ronit123@test.eq618.mongodb.net/videotoquiz?retryWrites=true&w=majority&appName=test",
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
