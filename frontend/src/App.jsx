import Home from "./components/Home";
import SignIn from "./components/SignIn";
import { Route, Routes } from "react-router-dom";
import UserState from "./context/userState";
import SignUp from "./components/SignUp";
import Quiz from "./components/Quiz";
import QuizState from "./context/quizState";
import ProtectedRoute from "./components/ProtectedRoute";
import Review from "./components/Review";

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
            <Route path="/review" element={<Review />}></Route>
          </Routes>
        </UserState>
      </QuizState>
    </>
  );
}
