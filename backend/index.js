const express = require("express");
const app = express();
const User = require("./db/user");
const Quiz = require("./db/quiz");
require("./db/config");
const cors = require("cors");
const mongoose = require("mongoose");

app.use(express.json());
app.use(cors());

// Test endpoint to check database connectivity
app.get("/test", async (req, res) => {
  try {
    const userCount = await User.countDocuments();
    res.json({ 
      message: "Database is working", 
      userCount,
      database: mongoose.connection.name,
      status: mongoose.connection.readyState === 1 ? "connected" : "disconnected"
    });
  } catch (error) {
    res.status(500).json({ 
      error: "Database test failed", 
      details: error.message 
    });
  }
});

app.post("/signup", async (req, res) => {
  try {
    console.log("Signup request received:", req.body);
    
    // Validate required fields
    const { name, email, password } = req.body;
    if (!name || !email || !password) {
      return res.status(400).json({ 
        error: "Missing required fields: name, email, and password are required" 
      });
    }

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ 
        error: "User with this email already exists" 
      });
    }

    // Create new user
    const user = new User({ name, email, password });
    console.log("Attempting to save user:", user);
    
    const savedUser = await user.save();
    console.log("User saved successfully:", savedUser);
    
    res.status(201).json({ 
      message: "User created successfully",
      user: {
        name: savedUser.name,
        email: savedUser.email
      }
    });
  } catch (error) {
    console.error("Error in signup:", error);
    res.status(500).json({ 
      error: "Failed to create user",
      details: error.message 
    });
  }
});

app.post("/signin", async (req, res) => {
  try {
    console.log("Signin request received:", req.body);
    
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ 
        error: "Email and password are required" 
      });
    }

    const user = await User.findOne({ email, password });
    if (!user) {
      return res.status(400).json({ 
        error: "Invalid email or password" 
      });
    }
    
    console.log("User found:", user);
    res.status(200).json({ 
      message: "Login Success", 
      name: user.name,
      email: user.email 
    });
  } catch (error) {
    console.error("Error in signin:", error);
    res.status(500).json({ 
      error: "Login failed",
      details: error.message 
    });
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

app.get("/scoreboard",async(req,res)=>{
  const data=await Quiz.find();
  console.log(data);
  res.send(data);
});

app.listen(2200, () => {
  console.log("Server is running on port 2200");
});