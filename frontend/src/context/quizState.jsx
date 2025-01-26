import { useState, React, Children } from "react";
import QuizContext from "./quizContext";
import { use } from "react";

export function QuizState(props) {
  const [quiz, setQuiz] = useState("");
  const [reviewQuiz, setReviewQuiz] = useState("");

  return (
    <QuizContext.Provider value={{ quiz, setQuiz, reviewQuiz, setReviewQuiz }}>
      {props.children}
    </QuizContext.Provider>
  );
}
