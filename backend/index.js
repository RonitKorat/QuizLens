const express = require("express");
const app = express();
const User = require("./db/user");
const Quiz = require("./db/quiz");
require("./db/config");
const cors = require("cors");
const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const Jwt_Key = "quiz";
const axios = require("axios");

const helmet = require("helmet");

app.use(
  helmet.contentSecurityPolicy({
    directives: {
      defaultSrc: ["'self'"],
      styleSrc: ["'self'", "https://fonts.googleapis.com"],
      fontSrc: ["'self'", "https://fonts.gstatic.com"],
      scriptSrc: ["'self'"],
      imgSrc: ["'self'"],
      connectSrc: ["'self'"],
      // Add these to fix your exact error
      styleSrcElem: ["'self'", "https://fonts.googleapis.com"],
      fontSrcElem: ["'self'", "https://fonts.gstatic.com"],
    },
  })
);

app.use(express.json());
app.use(cors());
app.use(helmet());

function verifyToken(req, res, next) {
  let token = req.headers["authorization"];
  if (token) {
    token = token.split(" ")[1];
    jwt.verify(token, Jwt_Key, (err, decoded) => {
      if (err) {
        res.status(403).send("please enter valid token");
      } else {
        req.user = decoded.user;
        next();
      }
    });
  } else {
    res.status(403).send("please enter token");
  }
}

// Test endpoint to check database connectivity
app.get("/test", async (req, res) => {
  try {
    const userCount = await User.countDocuments();
    res.json({
      message: "Database is working",
      userCount,
      database: mongoose.connection.name,
      status:
        mongoose.connection.readyState === 1 ? "connected" : "disconnected",
    });
  } catch (error) {
    res.status(500).json({
      error: "Database test failed",
      details: error.message,
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
        error:
          "Missing required fields: name, email, and password are required",
      });
    }

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({
        error: "User with this email already exists",
      });
    }

    // Create new user
    const user = new User({ name, email, password });
    console.log("Attempting to save user:", user);

    const savedUser = await user.save();
    console.log("User saved successfully:", savedUser);

    delete user.password;
    jwt.sign({ user }, Jwt_Key, (err, token) => {
      res.send({ user, auth: token });
    });
  } catch (error) {
    console.error("Error in signup:", error);
    res.status(500).json({
      error: "Failed to create user",
      details: error.message,
    });
  }
});

app.post("/signin", async (req, res) => {
  try {
    console.log("Signin request received:", req.body);

    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({
        error: "Email and password are required",
      });
    }

    const user = await User.findOne({ email, password });
    jwt.sign({ user }, Jwt_Key, { expiresIn: "2h" }, (err, token) => {
      res.send({ user, auth: token });
    });
  } catch (error) {
    console.error("Error in signin:", error);
    res.status(500).json({
      error: "Login failed",
      details: error.message,
    });
  }
});

app.post("/quiz", verifyToken, async (req, res) => {
  try {
    // Accept all quiz data from frontend
    const { title, user, questions, score, time } = req.body;
    if (!title || !questions || !user) {
      return res.status(400).json({ message: "Missing required quiz data" });
    }
    let quiz = new Quiz({
      title,
      user,
      questions,
      score: score || 0,
      time: time || 0,
    });
    quiz = await quiz.save();
    res.status(201).json({ message: "Quiz saved successfully", quiz });
  } catch (error) {
    console.error("Error in /quiz:", error);
    res
      .status(400)
      .json({ message: "Error saving quiz", error: error.message });
  }
});

app.get("/allquiz", verifyToken, async (req, res) => {
  try {
    const user = req.user.email;
    const quizzes = await Quiz.find({ user });
    res.json({ quizzes });
  } catch (error) {
    res
      .status(403)
      .send({ message: "error in fetching quiz", error: error.message });
  }
});

app.get("/quiz/:quizId", verifyToken, async (req, res) => {
  try {
    const quizId = req.params.quizId;
    const quiz = await Quiz.findById(quizId);
    if (!quiz) {
      return res.status(404).json({ error: "Quiz not found" });
    }
    if (quiz.user !== req.user.email) {
      return res.status(403).json({ error: "Unauthorized" });
    }
    res.status(200).json({ quiz });
  } catch (error) {
    res
      .status(500)
      .send({ error: "Failed to fetch quiz", details: error.message });
  }
});

app.get("/leaderboard", async (req, res) => {
  try {
    const quizzes = await Quiz.find();
    const userStats = {};

    quizzes.forEach((quiz) => {
      const user = quiz.user;
      if (!userStats[user]) {
        userStats[user] = {
          user,
          totalScore: 0,
          totalQuizzes: 0,
          totalTime: 0,
        };
      }
      userStats[user].totalScore += quiz.score;
      userStats[user].totalQuizzes += 1;
      userStats[user].totalTime += quiz.time || 0;
    });

    // Get all unique user emails
    const userEmails = Object.keys(userStats);

    // Fetch user names from User collection
    const users = await User.find({ email: { $in: userEmails } });
    const emailToName = {};
    users.forEach((u) => {
      emailToName[u.email] = u.name;
    });

    // Build leaderboard with names
    const leaderboard = Object.values(userStats).map((u) => ({
      name: emailToName[u.user] || u.user, // fallback to email if name not found
      score: Math.round((u.totalScore / u.totalQuizzes) * 10),
      totalQuizzes: u.totalQuizzes,
      averageTime: u.totalQuizzes
        ? Math.round(u.totalTime / u.totalQuizzes)
        : 0,
    }));

    leaderboard.sort((a, b) => b.score - a.score);
    leaderboard.forEach((u, i) => (u.rank = i + 1));

    res.json(leaderboard);
  } catch (error) {
    res
      .status(500)
      .json({ error: "Failed to fetch leaderboard", details: error.message });
  }
});

app.get("/recent-quizzes", verifyToken, async (req, res) => {
  try {
    const userEmail = req.user.email;
    const recentQuizzes = await Quiz.find({ user: userEmail })
      .sort({ createdAt: -1 })
      .limit(3);
    res.status(200).json({ quizzes: recentQuizzes });
  } catch (error) {
    res
      .status(500)
      .json({
        error: "Failed to fetch recent quizzes",
        details: error.message,
      });
  }
});

app.get("/user-stats", verifyToken, async (req, res) => {
  try {
    const userEmail = req.user.email;
    const userQuizzes = await Quiz.find({ user: userEmail });
    if (userQuizzes.length === 0) {
      return res
        .status(200)
        .json({
          totalQuizzes: 0,
          averageScore: 0,
          quizzesThisWeek: 0,
          streak: 0,
        });
    }
    const totalQuizzes = userQuizzes.length;

    const totalScore = userQuizzes.reduce((sum, quiz) => sum + quiz.score, 0);
    const averageScore = Math.round((totalScore / totalQuizzes) * 10);
    const oneWeekAgo = new Date();
    oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
    const quizzesThisWeek = userQuizzes.filter((quiz) => {
      new Date(quiz.createdAt) >= oneWeekAgo;
    }).length;
    let streak = 0;
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    for (let i = 0; i < 30; i++) {
      const checkDate = new Date(today);
      checkDate.setDate(checkDate.getDate() - i);

      const hasQuizOnDate = userQuizzes.some((quiz) => {
        const quizDate = new Date(quiz.createdAt);
        quizDate.setHours(0, 0, 0, 0);
        return quizDate.getTime() === checkDate.getTime();
      });

      if (hasQuizOnDate) {
        streak++;
      } else {
        break;
      }
    }
    res.status(200).json({
      totalQuizzes,
      averageScore,
      quizzesThisWeek,
      streak,
    });
  } catch (error) {
    res.status.json({
      error: "Failed to fetch recent quiz",
      details: error.message,
    });
  }
});

// Add this endpoint to proxy quiz generation to Flask
app.post("/generate-quiz", async (req, res) => {
  try {
    const { transcription } = req.body;
    if (!transcription) {
      return res.status(400).json({ error: "Transcription is required" });
    }
    // Call Flask backend
    const flaskResponse = await axios.post(
      "http://localhost:5000/generate-quiz",
      { transcription }
    );
    res.json(flaskResponse.data);
  } catch (error) {
    console.error("Error in /generate-quiz proxy:", error.message);
    res
      .status(500)
      .json({ error: "Failed to generate quiz", details: error.message });
  }
});

app.listen(2200, () => {
  console.log("Server is running on port 2200");
});
