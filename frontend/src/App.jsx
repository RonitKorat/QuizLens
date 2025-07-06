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
import ScoreCard from "./main-components/ScoreCard";

export default function App() {
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
            <Route path="/review" element={<Review />}></Route>
            <Route path="/scorecard" element={<ScoreCard />}></Route>
          </Routes>
        </UserState>
      </QuizState>

      <Toaster/>
    </>
  );
}

