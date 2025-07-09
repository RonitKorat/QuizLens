import React, { useEffect, useState, useContext } from "react";
import QuizContext from "./context/quizContext";
import TotalQuizzes from "../components/TotalQuizzes";

export default function History() {
  const [historyData, setHistoryData] = useState([]);
  const { quiz } = useContext(QuizContext);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch("http://127.0.0.1:2200/history", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        });
        const data = await response.json();
        setHistoryData(data);
        console.log(data);
      } catch (error) {
        console.error("Error fetching history data:", error);
      }
    };
    fetchData();
  }, [quiz.user]);

  return (
    <div className="min-h-screen bg-gradient-to-r from-blue-500 to-purple-600 p-6 flex flex-col items-center">
      <div className="bg-white shadow-lg rounded-lg p-8 w-full max-w-4xl">
        <h1 className="text-3xl font-bold text-gray-800 mb-6 text-center">
          History
        </h1>
        {historyData.length > 0 ? (
          <ul className="list-disc list-inside">
            {historyData.map((item, index) => (
              <li key={index} className="text-gray-800">
                {item.questionText} - Score: {item.score}
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-gray-800">No history data available.</p>
        )}
      </div>
    </div>
  );
}
