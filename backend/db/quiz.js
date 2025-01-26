const mongoose = require("mongoose");

const questionSchema = new mongoose.Schema({
  questionText: { type: String, required: true },
  options: { type: [String], required: true },
  correctAnswer: { type: String, required: true },
  selectOption: { type: String, required: true },
});

const quizSchema = new mongoose.Schema({
  user: { type: String, required: true },
  questions: { type: [questionSchema], required: true },
  score: { type: Number, required: true },
  time: { type: Number, required: true },
});

const Quiz = mongoose.model("Quiz", quizSchema);

module.exports = Quiz;
