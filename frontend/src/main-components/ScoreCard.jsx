import React, { useEffect, useState } from "react";

export default function ScoreCard() {
  const [data, setData] = useState(null);

  useEffect(() => {
    fetch("http://127.0.0.1:2200/scoreboard", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((response) => response.json())
      .then((data) => {
        // Sort data by score and time
        const sortedData = data.sort((a, b) => {
          if (a.score === b.score) {
            return a.time - b.time; // Sort by time if scores are equal
          }
          return b.score - a.score; // Sort by score
        });
        setData(sortedData);
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
      });
  }, []);

  if (!data) {
    return <div className="flex justify-center items-center h-screen">Loading...</div>;
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-4xl font-bold text-center mb-8">Scoreboard</h1>
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white shadow-md rounded-lg overflow-hidden">
          <thead className="bg-gray-800 text-white">
            <tr>
              <th className="py-3 px-6 text-left">Rank</th>
              <th className="py-3 px-6 text-left">Name</th>
              <th className="py-3 px-6 text-left">Score</th>
              <th className="py-3 px-6 text-left">Time</th>
            </tr>
          </thead>
          <tbody>
            {data.map((item, index) => (
              <tr key={index} className={`text-center ${index % 2 === 0 ? 'bg-gray-100' : 'bg-white'}`}>
                <td className="py-3 px-6 border-b">{index + 1}</td>
                <td className="py-3 px-6 border-b">{item.user}</td>
                <td className="py-3 px-6 border-b">{item.score}</td>
                <td className="py-3 px-6 border-b">{item.time}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
