const express = require("express");
const app = express();
const User = require("./db/user");
const Quiz = require("./db/quiz");
require("./db/config");
const cors = require("cors");

app.use(express.json());
app.use(cors());

app.post("/signup", async (req, res) => {
  let user = new User(req.body);
  user = await user.save();
  res.send(user);
});

app.post("/signin", async (req, res) => {
  let email = req.body.email;
  let password = req.body.password;
  const user = await User.findOne({ email, password });
  if (!user) {
    return res.status(400).json({ message: "User not found" });
  } else {
    return res.status(200).json({ message: "Login Success", user });
  }
});

app.post("/quiz", async (req, res) => {
  try {
    let quiz = new Quiz(req.body);
    quiz = await quiz.save();
    res.status(201).json({ message: "Quiz saved successfully", quiz });
  } catch (error) {
    res.status(400).json({ message: "Error saving quiz", error });
  }
});

app.listen(2200, () => {
  console.log("Server is running on port 2200");
});