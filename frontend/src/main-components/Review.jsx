import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";

export default function Review() {
  const { quizId } = useParams();
  const [reviewQuiz, setReviewQuiz] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    fetch(`http://localhost:2200/quiz/${quizId}`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => res.json())
      .then((data) => setReviewQuiz(data.quiz));
      console.log(reviewQuiz);  
  }, [quizId]);

  if (!reviewQuiz || !reviewQuiz.questions) {
    return (
      <div className="min-h-screen bg-[rgb(10,25,47)] p-6 flex flex-col items-center">
        <div className="bg-white shadow-lg rounded-lg p-8 w-full max-w-4xl">
          <h1 className="text-3xl font-bold text-gray-800 mb-6 text-center">
            Loading...
          </h1>
        </div>
      </div>
    );
  }

  // Prepare scoreData in the format expected by QuizBreakdown
  const totalQuestions = reviewQuiz.questions.length;
  const score = typeof reviewQuiz.score === "number"
    ? reviewQuiz.score
    : reviewQuiz.questions.filter(q => q.isCorrect).length;
  const skippedCount = reviewQuiz.questions.filter(q => q.isSkipped).length;
  const scorePercentage = (score / totalQuestions) * 100;

  // Use the backend's fields directly
  const questions = reviewQuiz.questions.map((q) => ({
    questionText: q.questionText,
    options: q.options,
    correctAnswer: q.correctAnswer,
    selectedOption: q.selectedOption, // use selectedOption, not selectOption
    isCorrect: q.isCorrect,
    isSkipped: q.isSkipped,
    timeSpent: q.timeSpent,
  }));

  const scoreData = {
    score,
    totalQuestions,
    skippedCount,
    scorePercentage,
    questions,
  };

  const handleShowLeaderboard = () => {
    navigate("/leaderboard");
  };

  return (
    <div className="min-h-screen bg-[rgb(10,25,47)] p-6">
      <div className="max-w-4xl mx-auto bg-white shadow-lg rounded-lg p-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-6 text-center">
          Quiz Results
        </h1>
        {/* Score Summary */}
        <div className="bg-gradient-to-r from-blue-500 to-purple-600 text-white p-6 rounded-lg mb-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
            <div>
              <div className="text-2xl font-bold">{scoreData.score}</div>
              <div className="text-sm">Correct</div>
            </div>
            <div>
              <div className="text-2xl font-bold">{scoreData.totalQuestions - scoreData.score}</div>
              <div className="text-sm">Incorrect</div>
            </div>
            <div>
              <div className="text-2xl font-bold">{scoreData.skippedCount}</div>
              <div className="text-sm">Skipped</div>
            </div>
            <div>
              <div className="text-2xl font-bold">{scoreData.scorePercentage.toFixed(1)}%</div>
              <div className="text-sm">Score</div>
            </div>
          </div>
        </div>
        {/* Question Review */}
        <div className="space-y-4 mb-6">
          <h2 className="text-xl font-semibold text-gray-800">Question Review</h2>
          {scoreData.questions.map((q, index) => (
            <div key={index} className="border rounded-lg p-4">
              <div className="flex items-center justify-between mb-2">
                <span className="font-medium">Question {index + 1}</span>
                <span
                  className={`px-2 py-1 rounded text-sm ${
                    q.isSkipped
                      ? "bg-yellow-100 text-yellow-800"
                      : q.isCorrect
                      ? "bg-green-100 text-green-800"
                      : "bg-red-100 text-red-800"
                  }`}
                >
                  {q.isSkipped
                    ? "Skipped"
                    : q.isCorrect
                    ? "Correct"
                    : "Incorrect"}
                </span>
              </div>
              <p className="text-gray-700 mb-2">{q.questionText}</p>
              <div className="space-y-1">
                {q.options.map((option, optIndex) => (
                  <div
                    key={optIndex}
                    className={`p-2 rounded ${
                      optIndex + 1 === q.correctAnswer
                        ? "bg-green-50 border-green-200"
                        : optIndex + 1 === q.selectedOption
                        ? "bg-red-50 border-red-200"
                        : "bg-gray-50"
                    }`}
                  >
                    {optIndex + 1}. {option}
                    {optIndex + 1 === q.correctAnswer && (
                      <span className="ml-2 text-green-600">✓ Correct</span>
                    )}
                    {optIndex + 1 === q.selectedOption &&
                      optIndex + 1 !== q.correctAnswer && (
                        <span className="ml-2 text-red-600">✗ Your Answer</span>
                      )}
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
        {/* Action Buttons */}
        <div className="flex justify-center space-x-4">
          <Button
            onClick={handleShowLeaderboard}
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg"
          >
            View Leaderboard
          </Button>
          <Button
            onClick={() => navigate("/home")}
            className="bg-gray-600 hover:bg-gray-700 text-white px-6 py-2 rounded-lg"
          >
            Back to Home
          </Button>
        </div>
      </div>
    </div>
  );
}