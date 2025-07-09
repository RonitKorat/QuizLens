import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";

import { BrowserRouter } from "react-router-dom";
import { QuizState } from "./context/quizState";
import { UserState } from "./context/userState";
import { useNavigate } from "react-router-dom";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <BrowserRouter>
      <UserState>
        <QuizState>
          <App />
        </QuizState>
      </UserState>
    </BrowserRouter>
  </StrictMode>
);
