import React from "react";

const QuizQuestion = ({ question, currentQuestion, answers, handleOptionChange }) => (
  <div className="mb-6">
    <h2 className="text-xl font-semibold text-gray-800 mb-4">
      {question.question}
    </h2>
    <div className="space-y-3">
      {["choice1", "choice2", "choice3", "choice4"].map((choice, i) => (
        <label
          key={i}
          className={`flex items-center p-3 rounded-lg border-2 transition-all cursor-pointer ${
            answers[currentQuestion] === i + 1
              ? 'border-blue-500 bg-blue-50'
              : 'border-gray-200 hover:border-gray-300'
          }`}
        >
          <input
            type="radio"
            name={`question-${currentQuestion}`}
            value={i + 1}
            checked={answers[currentQuestion] === i + 1}
            onChange={() => handleOptionChange(currentQuestion, i + 1)}
            className="mr-3"
          />
          <span className="font-medium text-gray-800">
            {String.fromCharCode(65 + i)}. {question[choice]}
          </span>
        </label>
      ))}
    </div>
  </div>
);

export default QuizQuestion; 