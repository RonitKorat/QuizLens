import React from "react";

const QuizHeader = ({ currentQuestion, totalQuestions, timeLeft, answeredCount, formatTime }) => (
  <div className="flex justify-between items-center mb-6">
    <div>
      <h1 className="text-2xl font-bold text-gray-800">
        Advanced Quiz - Question {currentQuestion + 1} of {totalQuestions}
      </h1>
      <p className="text-gray-600">Timer: {formatTime(timeLeft)}</p>
    </div>
    <div className="text-right">
      <div className="text-sm text-gray-600">Progress</div>
      <div className="text-lg font-semibold text-blue-600">
        {answeredCount}/{totalQuestions}
      </div>
    </div>
  </div>
);

export default QuizHeader; 