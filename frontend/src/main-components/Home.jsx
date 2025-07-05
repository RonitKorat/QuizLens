import React, { useState, useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import UserContext from "../context/userContext";
import QuizContext from "../context/quizContext";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  Loader2, 
  Upload, 
  Link, 
  FileVideo, 
  Play, 
  BarChart3, 
  Clock, 
  Trophy, 
  BookOpen, 
  Settings, 
  LogOut, 
  User,
  TrendingUp,
  Sparkles,
  Zap,
  Target,
  Calendar,
  Star
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const AdvancedHomePage = () => {
  const [tab, setTab] = useState("link");
  const [videoURL, setVideoURL] = useState("");
  const [file, setFile] = useState(null);
  const [transcription, setTranscription] = useState("");
  const [isTranscription, setIsTranscription] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const [userStats, setUserStats] = useState({
    totalQuizzes: 12,
    averageScore: 85,
    quizzesThisWeek: 3,
    streak: 5
  });
  const [recentQuizzes, setRecentQuizzes] = useState([
    { id: 1, title: "JavaScript Fundamentals", score: 90, date: "2 hours ago" },
    { id: 2, title: "React Hooks", score: 75, date: "1 day ago" },
    { id: 3, title: "Python Basics", score: 95, date: "3 days ago" }
  ]);

  const { user } = useContext(UserContext);
  const navigate = useNavigate();
  const { setQuiz } = useContext(QuizContext);

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  };

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
      } else {
        setErrorMessage(data.error || "Failed to extract audio");
        setIsTranscription(false);
        setTranscription("");
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
      } else {
        setErrorMessage(data.error || "Failed to extract audio from video");
      }
    } catch (error) {
      setErrorMessage("Failed to extract audio from video");
    } finally {
      setLoading(false);
    }
  };

  const handleGenerateQuiz = async () => {
    if (!transcription) {
      setErrorMessage("Transcription is required to generate quiz.");
      return;
    }
    setLoading(true);
    try {
      const response = await fetch("http://localhost:5000/generate-quiz", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ transcription }),
      });
      const data = await response.json();
      if (response.ok) {
        setQuiz(data.quiz);
        navigate("/quiz", { state: { quiz: data.quiz, transcription } });
      } else {
        setErrorMessage(data.error || "Failed to generate quiz");
      }
    } catch (error) {
      setErrorMessage("Failed to generate quiz");
    } finally {
      setLoading(false);
    }
  };

  const getInitials = (name) => {
    if (!name) return "";
    return name.split(" ").map((n) => n[0].toUpperCase()).join("");
  };

  const handleLogout = () => {
    navigate("/signin");
  };

  const handleTabChange = (newTab) => {
    setTab(newTab);
    setErrorMessage("");
    setIsTranscription(false);
    setTranscription("");
    setVideoURL("");
    setFile(null);
  };

  const StatCard = ({ icon: Icon, title, value, subtitle, color }) => (
    <motion.div variants={itemVariants}>
      <Card className="bg-white/10 backdrop-blur-sm border-white/20 hover:bg-white/20 transition-all duration-300">
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-purple-200">{title}</p>
              <p className="text-2xl font-bold text-white">{value}</p>
              <p className="text-xs text-purple-300">{subtitle}</p>
            </div>
            <div className={`p-3 rounded-full ${color}`}>
              <Icon className="w-6 h-6 text-white" />
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-900">
      {/* Header */}
      <header className="bg-white/10 backdrop-blur-sm border-b border-white/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <motion.div 
              className="flex items-center space-x-3"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
            >
              <div className="p-2 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg">
                <Sparkles className="w-6 h-6 text-white" />
              </div>
              <h1 className="text-2xl font-bold text-white">QuizAI Dashboard</h1>
            </motion.div>

            {/* User Menu */}
            <div className="relative">
              <motion.div
                className="flex items-center space-x-3 bg-white/10 backdrop-blur-sm rounded-full px-4 py-2 cursor-pointer hover:bg-white/20 transition-all duration-300"
                onClick={() => setShowDropdown(!showDropdown)}
                whileHover={{ scale: 1.05 }}
              >
                <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center">
                  <span className="text-white font-semibold text-sm">
                    {getInitials(user?.name)}
                  </span>
                </div>
                <span className="text-white font-medium">{user?.name}</span>
                <User className="w-4 h-4 text-white" />
              </motion.div>

              <AnimatePresence>
                {showDropdown && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="absolute right-0 mt-2 w-48 bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl shadow-lg py-2 z-50"
                  >
                    <div className="px-4 py-2 border-b border-white/20">
                      <p className="text-white font-semibold">{user?.name}</p>
                      <p className="text-purple-200 text-sm">{user?.email}</p>
                    </div>
                    <button className="w-full text-left px-4 py-2 text-white hover:bg-white/20 flex items-center space-x-2">
                      <Settings className="w-4 h-4" />
                      <span>Settings</span>
                    </button>
                    <button 
                      onClick={handleLogout}
                      className="w-full text-left px-4 py-2 text-red-300 hover:bg-red-500/20 flex items-center space-x-2"
                    >
                      <LogOut className="w-4 h-4" />
                      <span>Logout</span>
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="space-y-8"
        >
          {/* Welcome Section */}
          <motion.div variants={itemVariants} className="text-center">
            <h2 className="text-4xl font-bold text-white mb-2">
              Welcome back, {user?.name}! 👋
            </h2>
            <p className="text-purple-200 text-lg">
              Ready to create amazing quizzes from your videos?
            </p>
          </motion.div>

          {/* Stats Grid */}
          <motion.div variants={itemVariants} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <StatCard
              icon={Trophy}
              title="Total Quizzes"
              value={userStats.totalQuizzes}
              subtitle="Created so far"
              color="bg-yellow-500"
            />
            <StatCard
              icon={Target}
              title="Average Score"
              value={`${userStats.averageScore}%`}
              subtitle="Your performance"
              color="bg-green-500"
            />
            <StatCard
              icon={TrendingUp}
              title="This Week"
              value={userStats.quizzesThisWeek}
              subtitle="Quizzes created"
              color="bg-blue-500"
            />
            <StatCard
              icon={Zap}
              title="Streak"
              value={userStats.streak}
              subtitle="Days active"
              color="bg-purple-500"
            />
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Upload Section */}
            <motion.div variants={itemVariants} className="lg:col-span-2">
              <Card className="bg-white/10 backdrop-blur-sm border-white/20">
                <CardHeader>
                  <CardTitle className="text-white flex items-center space-x-2">
                    <Upload className="w-5 h-5" />
                    <span>Create New Quiz</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  {/* Tab Navigation */}
                  <div className="flex space-x-1 bg-white/10 rounded-lg p-1">
                    <button
                      className={`flex-1 py-2 px-4 rounded-md font-medium transition-all duration-200 ${
                        tab === "link" 
                          ? "bg-white text-purple-600" 
                          : "text-white hover:bg-white/10"
                      }`}
                      onClick={() => handleTabChange("link")}
                    >
                      <Link className="w-4 h-4 inline mr-2" />
                      YouTube Link
                    </button>
                    <button
                      className={`flex-1 py-2 px-4 rounded-md font-medium transition-all duration-200 ${
                        tab === "local" 
                          ? "bg-white text-purple-600" 
                          : "text-white hover:bg-white/10"
                      }`}
                      onClick={() => handleTabChange("local")}
                    >
                      <FileVideo className="w-4 h-4 inline mr-2" />
                      Upload Video
                    </button>
                  </div>

                  {/* Tab Content */}
                  <AnimatePresence mode="wait">
                    {tab === "link" && (
                      <motion.div
                        key="link"
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: 20 }}
                        className="space-y-4"
                      >
                        <input
                          type="text"
                          placeholder="Paste YouTube URL here..."
                          value={videoURL}
                          onChange={(e) => setVideoURL(e.target.value)}
                          className="w-full px-4 py-3 bg-white/80 backdrop-blur-sm border border-white/30 rounded-lg text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500"
                        />
                        <Button
                          onClick={handleURLUpload}
                          disabled={loading}
                          className="w-full bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white font-semibold py-3 rounded-lg"
                        >
                          {loading ? (
                            <div className="flex items-center space-x-2">
                              <Loader2 className="w-5 h-5 animate-spin" />
                              <span>Processing...</span>
                            </div>
                          ) : (
                            <div className="flex items-center space-x-2">
                              <Play className="w-5 h-5" />
                              <span>Extract Audio</span>
                            </div>
                          )}
                        </Button>
                      </motion.div>
                    )}

                    {tab === "local" && (
                      <motion.div
                        key="local"
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: 20 }}
                        className="space-y-4"
                      >
                        <div className="border-2 border-dashed border-white/30 rounded-lg p-6 text-center hover:border-white/50 transition-colors">
                          <input
                            type="file"
                            accept="video/*"
                            onChange={(e) => setFile(e.target.files[0])}
                            className="hidden"
                            id="video-upload"
                          />
                          <label htmlFor="video-upload" className="cursor-pointer">
                            <FileVideo className="w-12 h-12 text-white/60 mx-auto mb-4" />
                            <p className="text-white font-medium">
                              {file ? file.name : "Click to select video file"}
                            </p>
                            <p className="text-purple-200 text-sm mt-2">
                              Supports MP4, AVI, MOV, MKV, WMV, FLV, WEBM, M4V
                            </p>
                          </label>
                        </div>
                        <Button
                          onClick={handleLocalUpload}
                          disabled={loading || !file}
                          className="w-full bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white font-semibold py-3 rounded-lg disabled:opacity-50"
                        >
                          {loading ? (
                            <div className="flex items-center space-x-2">
                              <Loader2 className="w-5 h-5 animate-spin" />
                              <span>Processing...</span>
                            </div>
                          ) : (
                            <div className="flex items-center space-x-2">
                              <Upload className="w-5 h-5" />
                              <span>Upload & Process</span>
                            </div>
                          )}
                        </Button>
                      </motion.div>
                    )}
                  </AnimatePresence>

                  {/* Error Message */}
                  <AnimatePresence>
                    {errorMessage && (
                      <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        className="p-4 bg-red-500/20 border border-red-500/30 rounded-lg"
                      >
                        <p className="text-red-200 text-sm">{errorMessage}</p>
                      </motion.div>
                    )}
                  </AnimatePresence>

                  {/* Generate Quiz Button */}
                  {isTranscription && (
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="pt-4 border-t border-white/20"
                    >
                      <Button
                        onClick={handleGenerateQuiz}
                        disabled={loading}
                        className="w-full bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white font-semibold py-3 rounded-lg"
                      >
                        {loading ? (
                          <div className="flex items-center space-x-2">
                            <Loader2 className="w-5 h-5 animate-spin" />
                            <span>Generating Quiz...</span>
                          </div>
                        ) : (
                          <div className="flex items-center space-x-2">
                            <BookOpen className="w-5 h-5" />
                            <span>Generate Quiz</span>
                          </div>
                        )}
                      </Button>
                    </motion.div>
                  )}
                </CardContent>
              </Card>
            </motion.div>

            {/* Recent Quizzes */}
            <motion.div variants={itemVariants}>
              <Card className="bg-white/10 backdrop-blur-sm border-white/20 h-fit">
                <CardHeader>
                  <CardTitle className="text-white flex items-center space-x-2">
                    <Clock className="w-5 h-5" />
                    <span>Recent Quizzes</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {recentQuizzes.map((quiz, index) => (
                    <motion.div
                      key={quiz.id}
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className="flex items-center justify-between p-3 bg-white/5 rounded-lg hover:bg-white/10 transition-colors cursor-pointer"
                    >
                      <div>
                        <p className="text-white font-medium">{quiz.title}</p>
                        <p className="text-purple-200 text-sm">{quiz.date}</p>
                      </div>
                      <div className="flex items-center space-x-2">
                        <div className="flex items-center space-x-1">
                          <Star className="w-4 h-4 text-yellow-400 fill-current" />
                          <span className="text-white font-semibold">{quiz.score}%</span>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                  <Button
                    variant="outline"
                    className="w-full border-white/20 text-white hover:bg-white/10"
                  >
                    View All Quizzes
                  </Button>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default AdvancedHomePage;
