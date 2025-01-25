import React, { useState, useContext, useEffect } from "react";
import QuizContext from "../context/quizContext";
import { useNavigate } from "react-router-dom";

const Quiz = () => {
  const { quiz } = useContext(QuizContext);

  const [answers, setAnswers] = useState({});
  const [submitted, setSubmitted] = useState(false);
  const [rewiewed, setReviewed] = useState(false);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [timeLeft, setTimeLeft] = useState(600); // 10 minutes timer

  const navigate = useNavigate("");

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prevTime) => (prevTime > 0 ? prevTime - 1 : 0));
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const handleOptionChange = (questionIndex, option) => {
    setAnswers({
      ...answers,
      [questionIndex]: option,
    });
  };

  const handleSubmit = () => {
    if (Object.keys(answers).length < quiz.length) {
      alert("Please answer all questions before submitting.");
      return;
    }

    let correctAnswers = 0;
    quiz.forEach((question, index) => {
      // console.log("question :", question.question);
      // console.log("answer :", answers[index]);
      console.log("correct answer ", question.answer);
      const selectedChoice = answers[index];
      const selectedChoiceNumber =
        ["choice1", "choice2", "choice3", "choice4"].indexOf(selectedChoice) +
        1;
      console.log("selected", selectedChoiceNumber);
      if (selectedChoiceNumber === question.answer) {
        correctAnswers++;
      }
    });
    // console.log(answers);
    // console.log(correctAnswers);
    setSubmitted(true);
    alert(`You got ${correctAnswers} out of ${quiz.length} correct!`);
  };

  const handleReview=()=>{
    navigate("/review");     
  }

  const handleNext = () => {
    if (currentQuestion < quiz.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    }
  };

  const handlePrev = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1);
    }
  };

  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${minutes}:${secs < 10 ? "0" : ""}${secs}`;
  };

  if (!quiz) {
    return (
      <div className="text-center text-xl font-semibold text-gray-800">
        No quiz data available.
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-dark-blue p-6 flex items-center justify-center">
      <div className="bg-white shadow-lg rounded-lg p-8 w-full max-w-3xl">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-gray-800">
            Question {currentQuestion + 1} of {quiz.length}
          </h1>
          <div className="text-xl font-semibold text-red-600">
            {formatTime(timeLeft)}
          </div>
        </div>
        <div className="mb-6">
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">
            {quiz[currentQuestion].question}
          </h2>
          <div className="grid grid-cols-1 gap-4">
            {["choice1", "choice2", "choice3", "choice4"].map((choice, i) => (
              <label
                key={i}
                className="flex items-center bg-purple-100 hover:bg-purple-200 p-2 rounded-md transition-all duration-300"
              >
                <input
                  type="radio"
                  name={`question-${currentQuestion}`}
                  value={choice}
                  checked={answers[currentQuestion] === choice}
                  onChange={() => handleOptionChange(currentQuestion, choice)}
                  className="mr-2"
                />
                <span className="font-medium text-gray-800">
                  {i + 1}. {quiz[currentQuestion][choice]}
                </span>
              </label>
            ))}
          </div>
        </div>
        <div className="flex justify-between">
          <button
            onClick={handlePrev}
            disabled={currentQuestion === 0}
            className="bg-blue-500 hover:bg-blue-600 text-white font-medium py-2 px-4 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-offset-2 transition-all duration-300"
          >
            Previous
          </button>
          {currentQuestion < quiz.length - 1 ? (
            <button
              onClick={handleNext}
              className="bg-blue-500 hover:bg-blue-600 text-white font-medium py-2 px-4 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-offset-2 transition-all duration-300"
            >
              Next
            </button>
          ) : (
            <button
              onClick={handleSubmit}
              className="bg-green-500 hover:bg-green-600 text-white font-medium py-2 px-4 rounded-md focus:outline-none focus:ring-2 focus:ring-green-400 focus:ring-offset-2 transition-all duration-300"
            >
              Submit
            </button>
          )}
        </div>
        {submitted && !rewiewed && (
          <div className="mt-6 text-center">
            <button
              onClick={handleReview}
              className="bg-yellow-500 hover:bg-yellow-600 text-white font-medium py-2 px-4 rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:ring-offset-2 transition-all duration-300"
            >
              Review
            </button>
          </div>
        )}
        {rewiewed && (
          <div className="mt-6 text-center text-xl font-semibold text-gray-800">
            Quiz submitted! Thank you for your participation.
          </div>
        )}
      </div>
    </div>
  );
};

export default Quiz;
