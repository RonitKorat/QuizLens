import React, { useState, useContext } from "react";
import QuizContext from "../context/quizContext";

const Quiz = () => {
  const { quiz } = useContext(QuizContext);

  const [answers, setAnswers] = useState({});
  const [submitted, setSubmitted] = useState(false);

  if (!quiz) {
    return <div className="text-center text-xl font-semibold text-gray-800">No quiz data available.</div>;
  }

  const handleOptionChange = (questionIndex, option) => {
    setAnswers({
      ...answers,
      [questionIndex]: option,
    });
  };

  const handleSubmit = () => {
    if (Object.keys(answers).length < quiz.length) {
      alert('Please answer all questions before submitting.');
      return;
    }

    let correctAnswers = 0;
    quiz.forEach((question, index) => {
      if (answers[index] === question.answer) {
        correctAnswers++;
      }
    });

    setSubmitted(true);
    alert(`You got ${correctAnswers} out of ${quiz.length} correct!`);
  };

  return (
    <div className="min-h-screen bg-gradient-to-r from-blue-500 to-purple-600 p-6 flex items-center justify-center">
      <div className="bg-white shadow-lg rounded-lg p-8 w-full max-w-3xl">
        <h1 className="text-4xl font-bold text-gray-800 mb-6 text-center">
          Generated Quiz
        </h1>
        {quiz.map((question, index) => (
          <div key={index} className="mb-6">
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">
              {question.question}
            </h2>
            <div className="grid grid-cols-1 gap-4">
              {["choice1", "choice2", "choice3", "choice4"].map((choice, i) => (
                <label key={i} className="flex items-center bg-purple-100 hover:bg-purple-200 p-2 rounded-md transition-all duration-300">
                  <input
                    type="radio"
                    name={`question-${index}`}
                    value={choice}
                    checked={answers[index] === choice}
                    onChange={() => handleOptionChange(index, choice)}
                    className="mr-2"
                  />
                  <span className="font-medium text-gray-800">
                    {String.fromCharCode(65 + i)}. {question[choice]}
                  </span>
                </label>
              ))}
            </div>
          </div>
        ))}
        <button
          onClick={handleSubmit}
          className="w-full bg-purple-500 hover:bg-purple-600 text-white font-medium py-2 px-4 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-400 focus:ring-offset-2 mt-4 transition-all duration-300"
        >
          Submit
        </button>
        {submitted && (
          <div className="mt-6 text-center text-xl font-semibold text-gray-800">
            Quiz submitted! Thank you for your participation.
          </div>
        )}
      </div>
    </div>
  );
};

export default Quiz;
