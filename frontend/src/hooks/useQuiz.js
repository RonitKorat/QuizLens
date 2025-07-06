import { useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import QuizContext from "../context/quizContext";
import UserContext from "../context/userContext";
import { useToast } from "@/hooks/use-toast";

export const useQuiz = () => {
  const { quiz, setReviewQuiz } = useContext(QuizContext);
  const { user } = useContext(UserContext);
  const navigate = useNavigate();
  const { toast } = useToast();

  // State management
  const [answers, setAnswers] = useState({});
  const [skippedQuestions, setSkippedQuestions] = useState(new Set());
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [timeLeft, setTimeLeft] = useState(60);
  const [quizCompleted, setQuizCompleted] = useState(false);
  const [showScoreBreakdown, setShowScoreBreakdown] = useState(false);
  const [scoreData, setScoreData] = useState(null);
  const [questionStartTime, setQuestionStartTime] = useState(Date.now());

  // Timer effect for each question
  useEffect(() => {
    if (!quizCompleted && quiz && quiz.length > 0) {
      setTimeLeft(60);
      setQuestionStartTime(Date.now());
      
      const timer = setInterval(() => {
        setTimeLeft((prevTime) => {
          if (prevTime <= 1) {
            handleTimeUp();
            return 60;
          }
          return prevTime - 1;
        });
      }, 1000);

      return () => clearInterval(timer);
    }
  }, [currentQuestion, quizCompleted]);

  const handleTimeUp = () => {
    if (!answers[currentQuestion]) {
      setSkippedQuestions(prev => new Set([...prev, currentQuestion]));
    }
    
    if (currentQuestion < quiz.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    } else {
      handleSubmit();
    }
  };

  const handleOptionChange = (questionIndex, optionIndex) => {
    setAnswers({
      ...answers,
      [questionIndex]: optionIndex,
    });
    if (skippedQuestions.has(questionIndex)) {
      setSkippedQuestions(prev => {
        const newSet = new Set(prev);
        newSet.delete(questionIndex);
        return newSet;
      });
    }
  };

  const handleSkip = () => {
    setSkippedQuestions(prev => new Set([...prev, currentQuestion]));
    if (currentQuestion < quiz.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    } else {
      handleSubmit();
    }
  };

  const handleNext = () => {
    if (currentQuestion < quiz.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    }
  };

  const handlePrev = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1);
    }
  };

  const handleSubmit = async () => {
    const totalTime = Date.now() - questionStartTime;
    
    let correctAnswers = 0;
    const questions = quiz.map((question, index) => {
      const selectedChoice = answers[index];
      const isCorrect = selectedChoice === question.answer;
      if (isCorrect) {
        correctAnswers++;
      }
      return {
        questionText: question.question,
        options: [
          question.choice1,
          question.choice2,
          question.choice3,
          question.choice4,
        ],
        correctAnswer: question.answer,
        selectedOption: selectedChoice,
        isCorrect: isCorrect,
        isSkipped: skippedQuestions.has(index),
        timeSpent: totalTime / 1000,
      };
    });

    const scorePercentage = (correctAnswers / quiz.length) * 100;
    const skippedCount = skippedQuestions.size;

    const data = {
      user: user.name,
      questions: questions,
      score: correctAnswers,
      totalQuestions: quiz.length,
      scorePercentage: scorePercentage,
      skippedCount: skippedCount,
      totalTime: totalTime / 1000,
    };

    setScoreData(data);
    setReviewQuiz(data);
    setQuizCompleted(true);

    try {
      const response = await fetch("http://localhost:2200/quiz", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });
      const result = await response.json();
      console.log("Advanced quiz saved successfully:", result);
    } catch (error) {
      console.error("Error saving advanced quiz:", error);
    }

    toast({
      title: "Quiz Completed!",
      description: `You scored ${correctAnswers}/${quiz.length} (${scorePercentage.toFixed(1)}%)`,
    });
  };

  const handleShowScoreBreakdown = () => {
    setShowScoreBreakdown(true);
  };

  const handleShowLeaderboard = () => {
    navigate("/leaderboard");
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs < 10 ? "0" : ""}${secs}`;
  };

  const getQuestionStatus = (index) => {
    if (answers[index]) return "answered";
    if (skippedQuestions.has(index)) return "skipped";
    return "unanswered";
  };

  return {
    quiz,
    answers,
    skippedQuestions,
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
  };
}; 