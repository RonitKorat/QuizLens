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
import React from "react";

class GlobalErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error("GlobalErrorBoundary caught an error:", error, errorInfo);
    this.setState({ errorInfo });
  }

  render() {
    if (this.state.hasError) {
      return (
        <div style={{ padding: 32, color: 'red', background: '#fff' }}>
          <h1>Something went wrong.</h1>
          <pre>{this.state.error && this.state.error.toString()}</pre>
          <pre>{this.state.errorInfo && this.state.errorInfo.componentStack}</pre>
        </div>
      );
    }
    return this.props.children;
  }
}

export default function App() {
  const { quiz } = useContext(QuizContext);

  // If your quiz state is { quizzes: [...] }
  const quizzes = Array.isArray(quiz) ? quiz : quiz?.quizzes || [];

  return (
    <>
      <GlobalErrorBoundary>
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
      </GlobalErrorBoundary>
      <Toaster/>
    </>
  );
}

