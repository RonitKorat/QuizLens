import React from "react";

const QuizProgress = ({ 
  currentQuestion, 
  totalQuestions, 
  answers, 
  skippedQuestions, 
  setCurrentQuestion, 
  getQuestionStatus 
}) => (
  <>
    {/* Progress Bar */}
    <div className="w-full bg-gray-200 rounded-full h-2 mb-6">
      <div 
        className="bg-blue-600 h-2 rounded-full transition-all duration-300"
        style={{ width: `${((currentQuestion + 1) / totalQuestions) * 100}%` }}
      ></div>
    </div>

    {/* Question Navigation */}
    <div className="flex flex-wrap gap-2 mb-6">
      {Array.from({ length: totalQuestions }, (_, index) => (
        <button
          key={index}
          onClick={() => setCurrentQuestion(index)}
          className={`w-8 h-8 rounded-full text-sm font-medium transition-all ${
            index === currentQuestion
              ? 'bg-blue-600 text-white'
              : getQuestionStatus(index) === 'answered'
              ? 'bg-green-500 text-white'
              : getQuestionStatus(index) === 'skipped'
              ? 'bg-yellow-500 text-white'
              : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
          }`}
        >
          {index + 1}
        </button>
      ))}
    </div>
  </>
);

export default QuizProgress; 