const mongoose = require("mongoose");

const questionSchema = new mongoose.Schema({
  questionText: { type: String, required: true },
  options: { type: [String], required: true },
  correctAnswer: { type: Number, required: true },
  selectedOption: { type: Number },
  isCorrect: { type: Boolean },
  isSkipped: { type: Boolean },
  timeSpent: { type: Number }
});

const quizSchema = new mongoose.Schema({
  title: { type: String, required: true },
  user: { type: String, required: true },
  questions: { type: [questionSchema], required: true },
  score: { type: Number, required: true },
  time: { type: Number, required: true },
});

const Quiz = mongoose.model("Quiz", quizSchema);

module.exports = Quiz;
