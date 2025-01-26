import React, { useState, useContext, useEffect } from "react";
import QuizContext from "../context/quizContext";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import UserContext from "../context/userContext";

const Quiz = () => {
  const { quiz, setReviewQuiz } = useContext(QuizContext);
  const { user } = useContext(UserContext);

  const [answers, setAnswers] = useState({});
  const [submitted, setSubmitted] = useState(false);
  const [reviewed, setReviewed] = useState(false);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [timeLeft, setTimeLeft] = useState(600); // 10 minutes timer

  const navigate = useNavigate("");
  const { toast } = useToast();

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prevTime) => (prevTime > 0 ? prevTime - 1 : 0));
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const handleOptionChange = (questionIndex, optionIndex) => {
    setAnswers({
      ...answers,
      [questionIndex]: optionIndex,
    });
  };
  const handleSubmit = async () => {
    if (Object.keys(answers).length < quiz.length) {
      toast({
        title: "Please answer all questions before submitting.",
      });
      return;
    }
    let correctAnswers = 0;
    const questions = quiz.map((question, index) => {
      const selectedChoice = answers[index];
      if (selectedChoice === question.answer) {
        correctAnswers++;
      }
      return {
        questionText: question.question,
        options: [
          question.choice1,
          question.choice2,
          question.choice3,
          question.choice4,
        ],
        correctAnswer: question.answer,
        selectOption: selectedChoice,
      };
    });

    const timeTaken = 600 - timeLeft; // Calculate time taken in seconds

    const data = {
      user: user.name,
      questions: questions,
      score: correctAnswers,
      time: timeTaken, // Add time taken to the data
    };

    setReviewQuiz(data);

    try {
      const response = await fetch("http://localhost:2200/quiz", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });
      const result = await response.json();
      console.log("Quiz saved successfully:", result);
    } catch (error) {
      console.error("Error saving quiz:", error);
    }

    setSubmitted(true);
    toast({
      title: "Quiz submitted! Thank you for your participation.",
      description: "Click Review button for review your quiz",
    });
    alert(`You got ${correctAnswers} out of ${quiz.length} correct!`);
  };

  const handleReview = () => {
    navigate("/review");
  };

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
    <div className="min-h-screen bg-[rgb(10,25,47)] p-6 flex items-center justify-center">
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
                  value={i + 1}
                  checked={answers[currentQuestion] === i + 1}
                  onChange={() => handleOptionChange(currentQuestion, i + 1)}
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
          <Button
            onClick={handlePrev}
            disabled={currentQuestion === 0}
            className="bg-blue-900 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-offset-2 transition-all duration-300"
          >
            Previous
          </Button>
          {currentQuestion < quiz.length - 1 ? (
            <Button
              onClick={handleNext}
              className="bg-blue-500 hover:bg-blue-600 text-white font-medium py-2 px-4 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-offset-2 transition-all duration-300"
            >
              Next
            </Button>
          ) : (
            <Button
              onClick={handleSubmit}
              className="bg-green-500 hover:bg-green-600 text-white font-medium py-2 px-4 rounded-md focus:outline-none focus:ring-2 focus:ring-green-400 focus:ring-offset-2 transition-all duration-300"
            >
              Submit
            </Button>
          )}
        </div>
        {submitted && !reviewed && (
          <div className="mt-6 text-center">
            <Button
              onClick={handleReview}
              className="bg-yellow-500 hover:bg-yellow-600 text-white font-medium py-2 px-4 rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:ring-offset-2 transition-all duration-300"
            >
              Review
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Quiz;
