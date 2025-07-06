import { useState } from "react";

export const useUpload = () => {
  const [tab, setTab] = useState("link");
  const [videoURL, setVideoURL] = useState("");
  const [file, setFile] = useState(null);
  const [transcription, setTranscription] = useState("");
  const [isTranscription, setIsTranscription] = useState(false);
  const [audioExtracted, setAudioExtracted] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const handleURLUpload = async () => {
    setErrorMessage("");
    if (!videoURL) {
      setErrorMessage("Please enter a valid video URL.");
      return;
    }
    setLoading(true);
    try {
      const response = await fetch("http://localhost:5000/extract-audio", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ youtube_url: videoURL }),
      });
      const data = await response.json();
      if (response.ok && data.transcription) {
        setIsTranscription(true);
        setTranscription(data.transcription);
        setAudioExtracted(true);
      } else {
        setErrorMessage(data.error || "Failed to extract audio");
        setIsTranscription(false);
        setTranscription("");
        setAudioExtracted(false);
      }
    } catch (error) {
      setErrorMessage("Failed to extract audio");
      setIsTranscription(false);
      setTranscription("");
    } finally {
      setLoading(false);
    }
  };

  const handleLocalUpload = async () => {
    setErrorMessage("");
    if (!file) {
      setErrorMessage("Please select a video file to upload.");
      return;
    }
    
    const allowedTypes = ['video/mp4', 'video/avi', 'video/mov', 'video/mkv', 'video/wmv', 'video/flv', 'video/webm', 'video/m4v'];
    if (!allowedTypes.includes(file.type)) {
      setErrorMessage("Please select a supported video format.");
      return;
    }
    
    const maxSize = 100 * 1024 * 1024;
    if (file.size > maxSize) {
      setErrorMessage("File size must be less than 100MB.");
      return;
    }
    
    setLoading(true);
    const formData = new FormData();
    formData.append("video", file);
    
    try {
      const response = await fetch("http://localhost:5000/upload-video", {
        method: "POST",
        body: formData,
      });
      
      const data = await response.json();
      if (response.ok) {
        setIsTranscription(true);
        setTranscription(data.transcription);
        setAudioExtracted(true);
      } else {
        setErrorMessage(data.error || "Failed to extract audio from video");
        setAudioExtracted(false);
      }
    } catch (error) {
      setErrorMessage("Failed to extract audio from video");
    } finally {
      setLoading(false);
    }
  };

  const handleTabChange = (newTab) => {
    setTab(newTab);
    setErrorMessage("");
    setIsTranscription(false);
    setTranscription("");
    setAudioExtracted(false);
    setVideoURL("");
    setFile(null);
  };

  const resetUpload = () => {
    setTab("link");
    setVideoURL("");
    setFile(null);
    setTranscription("");
    setIsTranscription(false);
    setAudioExtracted(false);
    setErrorMessage("");
    setLoading(false);
  };

  return {
    tab,
    setTab,
    videoURL,
    setVideoURL,
    file,
    setFile,
    transcription,
    setTranscription,
    isTranscription,
    setIsTranscription,
    audioExtracted,
    setAudioExtracted,
    errorMessage,
    setErrorMessage,
    loading,
    setLoading,
    handleURLUpload,
    handleLocalUpload,
    handleTabChange,
    resetUpload
  };
}; 