import React, { useContext } from "react";
import QuizContext from "../context/quizContext";
import { useNavigate } from "react-router-dom";

export default function Review() {
  const { reviewQuiz } = useContext(QuizContext);
  const navigate=useNavigate();
  console.log("quiz:", reviewQuiz);

  if (!reviewQuiz || !reviewQuiz.questions) {
    return (
      <div className="min-h-screen bg-gradient-to-r from-blue-500 to-purple-600 p-6 flex flex-col items-center">
        <div className="bg-white shadow-lg rounded-lg p-8 w-full max-w-4xl">
          <h1 className="text-3xl font-bold text-gray-800 mb-6 text-center">
            No quiz data available.
          </h1>
        </div>
      </div>
    );
  }

  const handleScorecard=()=>{
    navigate('/scorecard');
  };

  return (
    <div className="min-h-screen bg-gradient-to-r from-blue-500 to-purple-600 p-6 flex flex-col items-center">
      <div className="bg-white shadow-lg rounded-lg p-8 w-full max-w-4xl">
        <h1 className="text-3xl font-bold text-gray-800 mb-6 text-center">
          Review Your Quiz
        </h1>
        <div className="mb-4">
          <h2 className="text-2xl font-semibold text-gray-800">
            User: {reviewQuiz.user}
          </h2>
        </div>
        {reviewQuiz.questions.map((question, index) => (
          <div
            key={index}
            className="mb-6 p-6 rounded-lg border border-gray-300 bg-gray-50 shadow-md"
          >
            <h3 className="text-lg font-semibold text-gray-800 mb-4">
              {index + 1}. {question.questionText}
            </h3>
            <div className="grid grid-cols-1 gap-4">
              {question.options.map((option, i) => {
                let bgColor = "bg-white border-gray-300";
                if (question.correctAnswer === question.selectOption) {
                  if (option === question.correctAnswer)
                    bgColor = "bg-green-200 border-green-500";
                } else {
                  if (option === question.correctAnswer)
                    bgColor = "bg-green-200 border-green-500";
                  else if (option === question.selectOption)
                    bgColor = "bg-red-200 border-red-500";
                }
                return (
                  <div
                    key={i}
                    className={`p-4 rounded-md text-gray-900 font-medium shadow-sm border transition-all duration-300 ${bgColor}`}
                  >
                    {i + 1}. {option}
                  </div>
                );
              })}
            </div>
            <div className="mt-2 text-gray-800">
              {question.correctAnswer === question.selectOption ? (
                <span className="text-green-600">Correct (1/1)</span>
              ) : (
                <span className="text-red-600">
                  Incorrect (0/1) - Correct Answer:{" "}
                  <span className="text-green-600">
                    {question.correctAnswer}
                  </span>
                </span>
              )}
            </div>
            <div className="mt-4 text-gray-800">
              <span>Selected option: {question.selectOption}</span>
            </div>
          </div>
        ))}
        <div className="mt-8 text-center">
          <h2 className="text-3xl font-extrabold text-gray-900">
            Total Score:{" "}
            <span className="text-indigo-600">{reviewQuiz.score}</span> /{" "}
            {reviewQuiz.questions.length}
          </h2>
        </div>
        <div className="mt-6 text-center">
          <button
            onClick={handleScorecard}
            className="bg-blue-500 hover:bg-blue-600 text-white font-medium py-2 px-4 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-offset-2 transition-all duration-300"
          >
            Scorecard
          </button>
        </div>
      </div>
    </div>
  );
}