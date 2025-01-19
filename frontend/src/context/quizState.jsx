import { useState,React, Children } from "react";
import QuizContext from "./quizContext";

const QuizState=(props)=>{
  const [quiz,setQuiz]=useState('');



  return (
    <QuizContext.Provider value={{quiz,setQuiz}}>
      {props.children}
    </QuizContext.Provider>
  )
}

export default QuizState;