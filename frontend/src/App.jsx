import Home from "./main-components/Home";
import SignIn from "./main-components/SignIn";
import { Route, Routes } from "react-router-dom";
import {UserState} from "./context/userState";
import SignUp from "./main-components/SignUp";
import Quiz from "./main-components/Quiz";
import Leaderboard from "./main-components/Leaderboard";
import {QuizState} from "./context/quizState";
import ProtectedRoute from "./main-components/ProtectedRoute";
import Review from "./main-components/Review";
import { Toaster } from "@/components/ui/toaster"
import TotalQuizzes from "./components/TotalQuizzes";
import { useContext } from "react";
import QuizContext from "./context/quizContext";
import AllQuizzes from "./components/AllQuizzes";

export default function App() {
  const { quiz } = useContext(QuizContext);

  // If your quiz state is { quizzes: [...] }
  const quizzes = Array.isArray(quiz) ? quiz : quiz?.quizzes || [];

  return (
    <>
      <QuizState>
        <UserState>
          <Routes>
            <Route path="/" element={<SignUp />}></Route>
            <Route path="/signup" element={<SignUp />}></Route>
            <Route path="/signin" element={<SignIn />}></Route>

            <Route
              path="/home"
              element={
                <ProtectedRoute>
                  <Home />
                </ProtectedRoute>
              }
            ></Route>
            <Route
              path="/quiz"
              element={
                <ProtectedRoute>
                  <Quiz />
                </ProtectedRoute>
              }
            ></Route>
            <Route
              path="/leaderboard"
              element={
                <ProtectedRoute>
                  <Leaderboard />
                </ProtectedRoute>
              }
            ></Route>
            <Route path="/review/:quizId" element={<Review />} />
            <Route path="/total-quizzes" element={<TotalQuizzes />} />
            <Route path="/all-quizzes" element={<AllQuizzes />} />
          </Routes>
        </UserState>
      </QuizState>

      <Toaster/>
    </>
  );
}

