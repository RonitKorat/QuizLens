import { useContext } from "react";
import { useNavigate } from "react-router-dom";
import QuizContext from "../context/quizContext";

function TotalQuizzes() {
  const { quiz } = useContext(QuizContext);
  const navigate = useNavigate();

  // If your quiz state is an object like { quizzes: [...] }
  const quizzes = quiz?.quizzes || [];

  if (!quizzes.length) {
    return <div className="text-white">No quizzes found.</div>;
  }

  return (
    <div>
      <h3 className="text-xl font-bold text-white mb-2">All Quizzes</h3>
      <div className="space-y-2">
        {quizzes.map(q => (
          <div
            key={q._id || q.id}
            className="bg-purple-800 text-white p-3 rounded cursor-pointer hover:bg-purple-700 transition"
            onClick={() => navigate(`/review/${q._id || q.id}`)}
          >
            {q.title}
          </div>
        ))}
      </div>
    </div>
  );
}

export default TotalQuizzes; 