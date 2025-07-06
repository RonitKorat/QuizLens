import React, { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import UserContext from "../context/userContext";
import QuizContext from "../context/quizContext";
import { motion } from "framer-motion";
import { Loader2, Trophy, Target, TrendingUp, Zap } from "lucide-react";

// Import components
import Header from "../components/Header";
import StatCard from "../components/StatCard";
import UploadSection from "../components/UploadSection";
import RecentQuizzes from "../components/RecentQuizzes";
import { useUpload } from "../hooks/useUpload";

// Animation variants
const containerVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.1 } }
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 }
};

const AdvancedHomePage = () => {
  const [showDropdown, setShowDropdown] = useState(false);
  const [recentQuizzes] = useState([
    { id: 1, title: "JavaScript Fundamentals", score: 90, date: "2 hours ago" },
    { id: 2, title: "React Hooks", score: 75, date: "1 day ago" },
    { id: 3, title: "Python Basics", score: 95, date: "3 days ago" }
  ]);

  const { user, userStats, setUserStats, setUser, isLoading } = useContext(UserContext);
  const navigate = useNavigate();
  const { setQuiz } = useContext(QuizContext);

  // Use custom upload hook
  const uploadHook = useUpload();

  const updateStatsAfterQuizGeneration = () => {
    setUserStats(prevStats => ({
      ...prevStats,
      totalQuizzes: (prevStats?.totalQuizzes || 0) + 1,
      quizzesThisWeek: (prevStats?.quizzesThisWeek || 0) + 1
    }));
  };

  const handleGenerateQuiz = async () => {
    if (!uploadHook.transcription) {
      uploadHook.setErrorMessage("Transcription is required to generate quiz.");
      return;
    }
    uploadHook.setLoading(true);
    try {
      const response = await fetch("http://localhost:5000/generate-quiz", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ transcription: uploadHook.transcription }),
      });
      const data = await response.json();
      if (response.ok) {
        setQuiz(data.quiz);
        updateStatsAfterQuizGeneration();
        navigate("/quiz", { state: { quiz: data.quiz, transcription: uploadHook.transcription } });
      } else {
        uploadHook.setErrorMessage(data.error || "Failed to generate quiz");
      }
    } catch (error) {
      uploadHook.setErrorMessage("Failed to generate quiz");
    } finally {
      uploadHook.setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('user');
    localStorage.removeItem('userStats');
    setUser({ name: '', email: '' });
    navigate("/signin");
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-900 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-8 h-8 text-white animate-spin mx-auto mb-4" />
          <p className="text-white">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-900">
      <Header 
        user={user} 
        showDropdown={showDropdown} 
        setShowDropdown={setShowDropdown} 
        navigate={navigate} 
        handleLogout={handleLogout} 
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="space-y-8"
        >
          <motion.div variants={itemVariants} className="text-center">
            <h2 className="text-4xl font-bold text-white mb-2">
              Welcome back, {user?.name}! 👋
            </h2>
            <p className="text-purple-200 text-lg">
              Ready to create amazing quizzes from your videos?
            </p>
          </motion.div>

          <motion.div variants={itemVariants} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <StatCard icon={Trophy} title="Total Quizzes" value={userStats?.totalQuizzes || 0} subtitle="Created so far" color="bg-yellow-500" />
            <StatCard icon={Target} title="Average Score" value={`${userStats?.averageScore || 0}%`} subtitle="Your performance" color="bg-green-500" />
            <StatCard icon={TrendingUp} title="This Week" value={userStats?.quizzesThisWeek || 0} subtitle="Quizzes created" color="bg-blue-500" />
            <StatCard icon={Zap} title="Streak" value={userStats?.streak || 0} subtitle="Days active" color="bg-purple-500" />
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <motion.div variants={itemVariants} className="lg:col-span-2">
              <UploadSection 
                {...uploadHook}
                handleGenerateQuiz={handleGenerateQuiz}
              />
            </motion.div>
            <motion.div variants={itemVariants}>
              <RecentQuizzes recentQuizzes={recentQuizzes} />
            </motion.div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default AdvancedHomePage;
