import Home from "./components/Home";
import SignIn from "./components/SignIn";
import { Route, Routes } from "react-router-dom";
import UserState from "./context/userState";
import SignUp from "./components/SignUp";
import Quiz from "./components/Quiz";
export default function App() {
  return (
    <>
      <UserState>
        <Routes>
          <Route path="/" element={<SignUp />}></Route>
          <Route path="/signup" element={<SignUp />}></Route>
          <Route path="/signin" element={<SignIn />}></Route>
          <Route path="/home" element={<Home />}></Route>
          <Route path="/quiz" element={<Quiz />}></Route>
        </Routes>
      </UserState>
    </>
  );
}
