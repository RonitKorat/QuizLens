import React from "react";
import { useLocation } from "react-router-dom";

const Quiz = () => {
  const location = useLocation();
  const { quiz } = location.state || {};

  if (!quiz) {
    return <div>No quiz data available.</div>;
  }

  return (
    <div className="min-h-screen bg-gradient-to-r from-green-400 to-blue-500 p-6 flex items-center justify-center">
      <div className="bg-white shadow-lg rounded-lg p-8 w-full max-w-3xl">
        <h1 className="text-4xl font-bold text-gray-800 mb-6 text-center">
          Generated Quiz
        </h1>
        {quiz.map((question, index) => (
          <div key={index} className="mb-6">
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">
              {question.question}
            </h2>
            <div className="grid grid-cols-2 gap-4">
              <button className="bg-purple-500 hover:bg-purple-600 text-white font-medium py-2 px-4 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-400 focus:ring-offset-2">
                {question.choice1}
              </button>
              <button className="bg-purple-500 hover:bg-purple-600 text-white font-medium py-2 px-4 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-400 focus:ring-offset-2">
                {question.choice2}
              </button>
              <button className="bg-purple-500 hover:bg-purple-600 text-white font-medium py-2 px-4 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-400 focus:ring-offset-2">
                {question.choice3}
              </button>
              <button className="bg-purple-500 hover:bg-purple-600 text-white font-medium py-2 px-4 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-400 focus:ring-offset-2">
                {question.choice4}
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Quiz;
