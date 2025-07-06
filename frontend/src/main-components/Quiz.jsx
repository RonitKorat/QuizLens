import React from "react";
import { useQuiz } from "../hooks/useQuiz";

// Import components
import QuizHeader from "../components/QuizHeader";
import QuizProgress from "../components/QuizProgress";
import QuizQuestion from "../components/QuizQuestion";
import QuizActions from "../components/QuizActions";
import QuizResults from "../components/QuizResults";
import QuizBreakdown from "../components/QuizBreakdown";

const Quiz = () => {
  const {
    quiz,
    answers,
    currentQuestion,
    setCurrentQuestion,
    timeLeft,
    quizCompleted,
    showScoreBreakdown,
    scoreData,
    handleOptionChange,
    handleSkip,
    handleNext,
    handlePrev,
    handleSubmit,
    handleShowScoreBreakdown,
    handleShowLeaderboard,
    formatTime,
    getQuestionStatus,
    navigate
  } = useQuiz();

  // No quiz available
  if (!quiz || quiz.length === 0) {
    return (
      <div className="min-h-screen bg-[rgb(10,25,47)] flex items-center justify-center">
        <div className="bg-white shadow-lg rounded-lg p-8 text-center">
          <h1 className="text-2xl font-bold text-gray-800 mb-4">No Quiz Available</h1>
          <p className="text-gray-600">Please upload a video to generate a quiz first.</p>
        </div>
      </div>
    );
  }

  // Show score breakdown
  if (showScoreBreakdown && scoreData) {
    return (
      <QuizBreakdown 
        scoreData={scoreData}
        handleShowLeaderboard={handleShowLeaderboard}
        navigate={navigate}
      />
    );
  }

  // Show quiz completion results
  if (quizCompleted && scoreData) {
    return (
      <QuizResults 
        scoreData={scoreData}
        handleShowScoreBreakdown={handleShowScoreBreakdown}
        handleShowLeaderboard={handleShowLeaderboard}
        navigate={navigate}
      />
    );
  }

  // Main quiz interface
  return (
    <div className="min-h-screen bg-[rgb(10,25,47)] p-6">
      <div className="max-w-4xl mx-auto bg-white shadow-lg rounded-lg p-8">
        <QuizHeader 
          currentQuestion={currentQuestion}
          totalQuestions={quiz.length}
          timeLeft={timeLeft}
          answeredCount={Object.keys(answers).length}
          formatTime={formatTime}
        />

        <QuizProgress 
          currentQuestion={currentQuestion}
          totalQuestions={quiz.length}
          answers={answers}
          setCurrentQuestion={setCurrentQuestion}
          getQuestionStatus={getQuestionStatus}
        />

        <QuizQuestion 
          question={quiz[currentQuestion]}
          currentQuestion={currentQuestion}
          answers={answers}
          handleOptionChange={handleOptionChange}
        />

        <QuizActions 
          currentQuestion={currentQuestion}
          totalQuestions={quiz.length}
          handlePrev={handlePrev}
          handleSkip={handleSkip}
          handleNext={handleNext}
          handleSubmit={handleSubmit}
          timeLeft={timeLeft}
        />
      </div>
    </div>
  );
};

export default Quiz;
