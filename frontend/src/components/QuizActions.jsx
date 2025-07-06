import React from "react";
import { Button } from "@/components/ui/button";

const QuizActions = ({ 
  currentQuestion, 
  totalQuestions, 
  handlePrev, 
  handleSkip, 
  handleNext, 
  handleSubmit,
  timeLeft 
}) => (
  <>
    {/* Action Buttons */}
    <div className="flex justify-between items-center">
      <div className="flex space-x-3">
        <Button
          onClick={handlePrev}
          disabled={currentQuestion === 0}
          className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded-lg disabled:opacity-50"
        >
          Previous
        </Button>
        <Button
          onClick={handleSkip}
          className="bg-yellow-500 hover:bg-yellow-600 text-white px-4 py-2 rounded-lg"
        >
          Skip
        </Button>
      </div>
      
      <div className="flex space-x-3">
        {currentQuestion < totalQuestions - 1 ? (
          <Button
            onClick={handleNext}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg"
          >
            Next
          </Button>
        ) : (
          <Button
            onClick={handleSubmit}
            className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-lg"
          >
            Submit Quiz
          </Button>
        )}
      </div>
    </div>

    {/* Timer Warning */}
    {timeLeft <= 10 && (
      <div className="mt-4 p-3 bg-red-100 border border-red-300 rounded-lg">
        <p className="text-red-700 font-medium">
          ⏰ Time is running out! {timeLeft} seconds remaining.
        </p>
      </div>
    )}
  </>
);

export default QuizActions; 