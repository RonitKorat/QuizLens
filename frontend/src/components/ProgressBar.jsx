import React, { useState, useEffect } from "react";
import { io } from "socket.io-client";

const ProgressBar = () => {
  const [progress, setProgress] = useState(0);
  const [transcription, setTranscription] = useState(null);

  useEffect(() => {
    const socket = io("http://localhost:5000");

    socket.on("progress_update", (data) => {
      setProgress(data.progress * 100);
    });

    socket.on("transcription_complete", (data) => {
      setTranscription(data.transcription);
      alert("Transcription completed!");
    });

    socket.on("transcription_error", (data) => {
      alert(`Transcription error: ${data.error}`);
    });

    return () => {
      socket.disconnect();
    };
  }, []);

  return (
    <div>
      <div
        style={{
          width: "100%",
          backgroundColor: "#f3f3f3",
          borderRadius: "5px",
          overflow: "hidden",
          marginTop: "20px",
        }}
      >
        <div
          style={{
            height: "20px",
            width: `${progress}%`,
            backgroundColor: "#4caf50",
            transition: "width 0.2s",
          }}
        ></div>
      </div>
      <p>{progress}%</p>
      {transcription && (
        <div>
          <h2>Transcription Completed:</h2>
          <pre>{transcription}</pre>
        </div>
      )}
    </div>
  );
};

export default ProgressBar;
