import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  Trophy, 
  Medal, 
  Award, 
  ArrowLeft, 
  TrendingUp, 
  Clock, 
  Star,
  Crown,
  Target,
  Zap
} from "lucide-react";
import { motion } from "framer-motion";

const Leaderboard = () => {
  const [leaderboardData, setLeaderboardData] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    fetchLeaderboardData();
  }, []);

  const fetchLeaderboardData = async () => {
    try {
      const response = await fetch("http://localhost:2200/leaderboard");
      if (response.ok) {
        const data = await response.json();
        setLeaderboardData(data);
      } else {
        // If no data from API, use mock data
        setLeaderboardData([
          { name: "John Doe", score: 95, totalQuizzes: 15, averageTime: 45, rank: 1 },
          { name: "Jane Smith", score: 92, totalQuizzes: 12, averageTime: 52, rank: 2 },
          { name: "Mike Johnson", score: 88, totalQuizzes: 18, averageTime: 48, rank: 3 },
          { name: "Sarah Wilson", score: 85, totalQuizzes: 10, averageTime: 55, rank: 4 },
          { name: "David Brown", score: 82, totalQuizzes: 14, averageTime: 50, rank: 5 },
          { name: "Emily Davis", score: 78, totalQuizzes: 8, averageTime: 58, rank: 6 },
          { name: "Chris Lee", score: 75, totalQuizzes: 11, averageTime: 62, rank: 7 },
          { name: "Lisa Garcia", score: 72, totalQuizzes: 9, averageTime: 65, rank: 8 },
          { name: "Tom Martinez", score: 68, totalQuizzes: 13, averageTime: 70, rank: 9 },
          { name: "Anna Taylor", score: 65, totalQuizzes: 7, averageTime: 75, rank: 10 }
        ]);
      }
    } catch (error) {
      console.error("Error fetching leaderboard:", error);
      // Use mock data on error
      setLeaderboardData([
        { name: "John Doe", score: 95, totalQuizzes: 15, averageTime: 45, rank: 1 },
        { name: "Jane Smith", score: 92, totalQuizzes: 12, averageTime: 52, rank: 2 },
        { name: "Mike Johnson", score: 88, totalQuizzes: 18, averageTime: 48, rank: 3 },
        { name: "Sarah Wilson", score: 85, totalQuizzes: 10, averageTime: 55, rank: 4 },
        { name: "David Brown", score: 82, totalQuizzes: 14, averageTime: 50, rank: 5 },
        { name: "Emily Davis", score: 78, totalQuizzes: 8, averageTime: 58, rank: 6 },
        { name: "Chris Lee", score: 75, totalQuizzes: 11, averageTime: 62, rank: 7 },
        { name: "Lisa Garcia", score: 72, totalQuizzes: 9, averageTime: 65, rank: 8 },
        { name: "Tom Martinez", score: 68, totalQuizzes: 13, averageTime: 70, rank: 9 },
        { name: "Anna Taylor", score: 65, totalQuizzes: 7, averageTime: 75, rank: 10 }
      ]);
    } finally {
      setLoading(false);
    }
  };

  const getRankIcon = (rank) => {
    switch (rank) {
      case 1:
        return <Crown className="w-6 h-6 text-yellow-500" />;
      case 2:
        return <Medal className="w-6 h-6 text-gray-400" />;
      case 3:
        return <Award className="w-6 h-6 text-amber-600" />;
      default:
        return <span className="text-lg font-bold text-gray-600">#{rank}</span>;
    }
  };

  const getRankColor = (rank) => {
    switch (rank) {
      case 1:
        return "bg-gradient-to-r from-yellow-400 to-yellow-600 text-white";
      case 2:
        return "bg-gradient-to-r from-gray-300 to-gray-500 text-white";
      case 3:
        return "bg-gradient-to-r from-amber-500 to-amber-700 text-white";
      default:
        return "bg-white hover:bg-gray-50";
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto mb-4"></div>
          <p className="text-white">Loading leaderboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-900 p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <div className="flex items-center justify-center mb-4">
            <Button
              onClick={() => navigate("/home")}
              variant="ghost"
              className="text-white hover:bg-white/10 mr-4"
            >
              <ArrowLeft className="w-5 h-5 mr-2" />
              Back to Home
            </Button>
            <Trophy className="w-12 h-12 text-yellow-400 mx-4" />
            <h1 className="text-4xl font-bold text-white">Leaderboard</h1>
          </div>
          <p className="text-purple-200 text-lg">
            Top performers in QuizAI challenges
          </p>
        </motion.div>

        {/* Stats Cards */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8"
        >
          <Card className="bg-white/10 backdrop-blur-sm border-white/20">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-purple-200">Total Participants</p>
                  <p className="text-2xl font-bold text-white">{leaderboardData.length}</p>
                </div>
                <TrendingUp className="w-8 h-8 text-green-400" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white/10 backdrop-blur-sm border-white/20">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-purple-200">Average Score</p>
                  <p className="text-2xl font-bold text-white">
                    {Math.round(leaderboardData.reduce((acc, user) => acc + user.score, 0) / leaderboardData.length)}%
                  </p>
                </div>
                <Target className="w-8 h-8 text-blue-400" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white/10 backdrop-blur-sm border-white/20">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-purple-200">Top Score</p>
                  <p className="text-2xl font-bold text-white">{leaderboardData[0]?.score || 0}%</p>
                </div>
                <Star className="w-8 h-8 text-yellow-400" />
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Leaderboard Table */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl overflow-hidden"
        >
          <CardHeader className="bg-white/5 border-b border-white/20">
            <CardTitle className="text-white text-xl">Top Performers</CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <div className="divide-y divide-white/10">
              {leaderboardData.map((user, index) => (
                <motion.div
                  key={user.rank}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.1 * index }}
                  className={`p-6 flex items-center justify-between ${getRankColor(user.rank)} transition-all duration-300 hover:scale-[1.02]`}
                >
                  <div className="flex items-center space-x-4">
                    <div className="flex items-center justify-center w-12 h-12 rounded-full bg-white/20">
                      {getRankIcon(user.rank)}
                    </div>
                    <div>
                      <h3 className="font-semibold text-lg">
                        {user.rank === 1 ? "🥇 " : user.rank === 2 ? "🥈 " : user.rank === 3 ? "🥉 " : ""}
                        {user.name}
                      </h3>
                      <p className="text-sm opacity-80">
                        {user.totalQuizzes} quizzes completed
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-6">
                    <div className="text-center">
                      <p className="text-sm opacity-80">Score</p>
                      <p className="text-xl font-bold">{user.score}%</p>
                    </div>
                    <div className="text-center">
                      <p className="text-sm opacity-80">Avg Time</p>
                      <p className="text-lg font-semibold flex items-center">
                        <Clock className="w-4 h-4 mr-1" />
                        {user.averageTime}s
                      </p>
                    </div>
                    <div className="text-center">
                      <p className="text-sm opacity-80">Quizzes</p>
                      <p className="text-lg font-semibold flex items-center">
                        <Zap className="w-4 h-4 mr-1" />
                        {user.totalQuizzes}
                      </p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </CardContent>
        </motion.div>
      </div>
    </div>
  );
};

export default Leaderboard; 