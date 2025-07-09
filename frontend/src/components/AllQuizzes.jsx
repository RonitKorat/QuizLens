import React, { useContext } from "react";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Clock, Star, FolderOpen } from "lucide-react";
import { useNavigate } from "react-router-dom";
import QuizContext from "../context/quizContext";

const AllQuizzes = () => {
  const navigate = useNavigate();
  const { quiz } = useContext(QuizContext);

  const quizzes = Array.isArray(quiz) ? quiz : quiz?.quizzes || [];

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-900 flex items-center justify-center py-10 px-2">
      <Card className="w-full max-w-3xl shadow-2xl bg-white/10 backdrop-blur-md border-white/20">
        <CardHeader className="bg-gradient-to-r from-purple-600 to-pink-500 rounded-t-lg p-6 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <Clock className="w-7 h-7 text-white" />
            <CardTitle className="text-white text-2xl font-bold">All Quizzes</CardTitle>
          </div>
        </CardHeader>
        <CardContent className="space-y-4 p-6">
          {quizzes.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12">
              <FolderOpen className="w-12 h-12 text-purple-300 mb-4" />
              <p className="text-purple-200 text-lg font-medium">No quizzes found. Start creating your first quiz!</p>
            </div>
          ) : (
            quizzes.map((q, index) => (
              <motion.div
                key={q.id || q._id || index}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.08 }}
                className="flex items-center justify-between p-5 bg-purple-800 rounded-lg border border-purple-700 hover:bg-purple-700 hover:scale-[1.025] hover:shadow-xl transition-all duration-200 cursor-pointer mb-2"
                onClick={() => navigate(`/review/${q.id || q._id}`)}
              >
                <div>
                  <p className="text-white font-semibold text-lg mb-1">{q.title}</p>
                  <p className="text-purple-200 text-xs">{q.date}</p>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="flex items-center space-x-1">
                    <Star className="w-5 h-5 text-yellow-400 fill-current" />
                    <span className="text-white font-semibold text-lg">{q.score}%</span>
                  </div>
                </div>
              </motion.div>
            ))
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default AllQuizzes;
