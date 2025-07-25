import React from "react";
import { Button } from "@/components/ui/button";

const QuizResults = ({ scoreData, handleShowScoreBreakdown, handleShowLeaderboard, navigate }) => {
  console.log("QuizResults scoreData", scoreData);
  return (
    <div className="min-h-screen bg-[rgb(10,25,47)] flex items-center justify-center p-6">
      <div className="bg-white shadow-lg rounded-lg p-8 max-w-md w-full text-center">
        <h1 className="text-2xl font-bold text-gray-800 mb-4">Quiz Completed!</h1>
        <div className="text-6xl font-bold text-blue-600 mb-4">
          {typeof scoreData.scorePercentage === "object" ? JSON.stringify(scoreData.scorePercentage) : scoreData.scorePercentage?.toFixed ? scoreData.scorePercentage.toFixed(0) : scoreData.scorePercentage}%
        </div>
        <p className="text-gray-600 mb-6">
          You got {typeof scoreData.score === "object" ? JSON.stringify(scoreData.score) : scoreData.score} out of {typeof scoreData.totalQuestions === "object" ? JSON.stringify(scoreData.totalQuestions) : scoreData.totalQuestions} questions correct
        </p>
        <div className="space-y-3">
          <Button
            onClick={handleShowScoreBreakdown}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-lg"
          >
            View Detailed Results
          </Button>
          <Button
            onClick={handleShowLeaderboard}
            className="w-full bg-green-600 hover:bg-green-700 text-white py-2 rounded-lg"
          >
            View Leaderboard
          </Button>
        </div>
      </div>
    </div>
  );
};

export default QuizResults; 