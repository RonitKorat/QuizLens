const mongoose = require("mongoose");

const questionSchema = new mongoose.Schema({
  questionText: { type: String, required: true },
  options: { type: [String], required: true },
  correctAnswer: { type: String, required: true },
  selectOption: { type: String, required: false }, // Make optional if needed
});

const quizSchema = new mongoose.Schema({
  user: { type: String, required: true },
  questions: { type: [questionSchema], required: true },
  score: { type: Number, required: true },
});

// Export the Quiz model
const Quiz = mongoose.model("quizzes", quizSchema);
module.exports = Quiz;
