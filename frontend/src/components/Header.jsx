import React from "react";
import { motion } from "framer-motion";
import { Sparkles } from "lucide-react";
import UserMenu from "./UserMenu";

const Header = ({ user, showDropdown, setShowDropdown, navigate, handleLogout }) => (
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
        <UserMenu 
          user={user} 
          showDropdown={showDropdown} 
          setShowDropdown={setShowDropdown} 
          navigate={navigate} 
          handleLogout={handleLogout} 
        />
      </div>
    </div>
  </header>
);

export default Header; 