import React from "react";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Clock, Star } from "lucide-react";

const RecentQuizzes = ({ recentQuizzes }) => (
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
    </CardContent>
  </Card>
);

export default RecentQuizzes; 