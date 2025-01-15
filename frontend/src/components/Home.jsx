import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import UserContext from '../context/userContext';

const UploadVideoPage = () => {
    const [videoFile, setVideoFile] = useState(null);
    const [videoURL, setVideoURL] = useState('');
    const [progress, setProgress] = useState(0);
    const [quiz, setQuiz] = useState('');
    const [transcription, setTranscription] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    const [showDropdown, setShowDropdown] = useState(false);
    const [uploading, setUploading] = useState(false);

    const { user } = useContext(UserContext);
    const navigate = useNavigate();

    const handleFileChange = (event) => {
        const file = event.target.files[0];
        const supportedFormats = ['video/mp4', 'video/avi', 'video/mov', 'video/mkv'];
        const maxSize = 100 * 1024 * 1024; // 100 MB

        if (file) {
            if (!supportedFormats.includes(file.type)) {
                setErrorMessage('Unsupported file format. Please upload MP4, AVI, MOV, or MKV files.');
                setVideoFile(null);
                return;
            }
            if (file.size > maxSize) {
                setErrorMessage('File size exceeds the limit of 100 MB.');
                setVideoFile(null);
                return;
            }
            setVideoFile(file);
            setErrorMessage('');
        }
    };

    const handleUpload = () => {
        if (!videoFile) {
            setErrorMessage('Please select a valid video file to upload.');
            return;
        }

        setUploading(true);
        setProgress(0);

        // Simulate upload process
        const interval = setInterval(() => {
            setProgress((prevProgress) => {
                if (prevProgress >= 100) {
                    clearInterval(interval);
                    setUploading(false);
                    return 100;
                }
                return prevProgress + 10;
            });
        }, 200);
    };

    const handleURLUpload = async () => {
        if (!videoURL) {
            setErrorMessage('Please enter a valid video URL.');
            return;
        }

        setUploading(true);
        setProgress(0);

        try {
            const response = await fetch('http://localhost:5000/extract-audio', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ youtube_url: videoURL }),
            });

            const data = await response.json();
            if (response.ok) {
                setTranscription(data.transcription);
                setProgress(100);
                setUploading(false);
            } else {
                setErrorMessage(data.error || 'Failed to extract audio');
                setUploading(false);
            }
        } catch (error) {
            setErrorMessage('Failed to extract audio');
            setUploading(false);
        }
    };

    const handleGenerateQuiz = async () => {
        if (!transcription) {
            setErrorMessage('Transcription is required to generate quiz.');
            return;
        }

        try {
            const response = await fetch('http://localhost:5000/generate-quiz', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ transcription }),
            });

            const data = await response.json();
            if (response.ok) {
                setQuiz(data.quiz);
                navigate('/quiz', { state: { quiz: data.quiz } });
            } else {
                setErrorMessage(data.error || 'Failed to generate quiz');
            }
        } catch (error) {
            setErrorMessage('Failed to generate quiz');
        }
    };

    const getInitials = (name) => {
        if (!name) return '';
        return name.split(' ').map((n) => n[0].toUpperCase()).join('');
    };

    const handleLogout = () => {
        // Handle logout logic here
        console.log('User logged out');
    };

    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-r from-blue-500 to-purple-600 p-6 relative">
            <div className="absolute top-4 right-4">
                <div className="relative">
                    <div
                        className="bg-white shadow-lg rounded-full p-4 flex items-center justify-center w-12 h-12 cursor-pointer"
                        onClick={() => setShowDropdown(!showDropdown)}
                    >
                        <span className="text-gray-800 font-bold text-lg">{getInitials(user?.name)}</span>
                    </div>
                    {showDropdown && (
                        <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-2 z-10">
                            <p className="px-4 py-2 text-gray-800 font-semibold">{user?.name}</p>
                            <p className="px-4 py-2 text-gray-600 text-sm">{user?.email}</p>
                            <button
                                className="w-full text-left px-4 py-2 text-red-600 hover:bg-gray-100 font-semibold"
                                onClick={handleLogout}
                            >
                                Log out
                            </button>
                        </div>
                    )}
                </div>
            </div>

            <div className="bg-white shadow-lg rounded-lg p-8 w-full max-w-md mb-6 transform transition duration-500 hover:scale-105">
                <h1 className="text-3xl font-bold text-gray-800 mb-6 text-center">Upload Video from Local Machine</h1>

                <div className="mb-4">
                    <label className="block text-gray-700 font-medium mb-2">Select a video file:</label>
                    <input
                        type="file"
                        accept="video/mp4, video/avi, video/mov, video/mkv"
                        className="block w-full text-sm text-gray-500 border border-gray-300 rounded-md shadow-sm focus:ring-purple-500 focus:border-purple-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-purple-100 file:text-purple-700 hover:file:bg-purple-200"
                        onChange={handleFileChange}
                    />
                    {errorMessage && <p className="text-red-500 text-sm mt-2">{errorMessage}</p>}
                </div>

                <div className="mb-4">
                    <p className="text-sm text-gray-600">Supported formats: MP4, AVI, MOV, MKV</p>
                    <p className="text-sm text-gray-600">Max size: 100 MB</p>
                </div>

                {!uploading && (
                    <button
                        className="w-full bg-purple-500 hover:bg-purple-600 text-white font-medium py-2 px-4 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-400 focus:ring-offset-2"
                        onClick={handleUpload}
                    >
                        Upload Video
                    </button>
                )}

                {uploading && (
                    <div className="w-full bg-gray-200 rounded-full h-4 mt-4">
                        <div className="bg-purple-500 h-4 rounded-full" style={{ width: `${progress}%` }}></div>
                    </div>
                )}
            </div>

            <div className="bg-white shadow-lg rounded-lg p-8 w-full max-w-md transform transition duration-500 hover:scale-105">
                <h1 className="text-3xl font-bold text-gray-800 mb-6 text-center">Upload Video from URL</h1>

                <div className="mb-4">
                    <label className="block text-gray-700 font-medium mb-2">Enter video URL:</label>
                    <input
                        type="text"
                        className="block w-full text-sm text-gray-500 border border-gray-300 rounded-md shadow-sm focus:ring-purple-500 focus:border-purple-500"
                        value={videoURL}
                        onChange={(e) => setVideoURL(e.target.value)}
                    />
                    {errorMessage && <p className="text-red-500 text-sm mt-2">{errorMessage}</p>}
                </div>

                {!uploading && (
                    <button
                        className="w-full bg-purple-500 hover:bg-purple-600 text-white font-medium py-2 px-4 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-400 focus:ring-offset-2"
                        onClick={handleURLUpload}
                    >
                        Upload Video
                    </button>
                )}

                {uploading && (
                    <div className="w-full bg-gray-200 rounded-full h-4 mt-4">
                        <div className="bg-purple-500 h-4 rounded-full" style={{ width: `${progress}%` }}></div>
                    </div>
                )}

                {transcription && (
                    <button
                        className="w-full bg-green-500 hover:bg-green-600 text-white font-medium py-2 px-4 rounded-md focus:outline-none focus:ring-2 focus:ring-green-400 focus:ring-offset-2 mt-4"
                        onClick={handleGenerateQuiz}
                    >
                        Generate Quiz
                    </button>
                )}
            </div>
        </div>
    );
};

export default UploadVideoPage;