import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { User, Award, Settings, LogOut } from "lucide-react";

const getInitials = (name) => {
  if (!name) return "";
  return name.split(" ").map((n) => n[0].toUpperCase()).join("");
};

const UserMenu = ({ user, showDropdown, setShowDropdown, navigate, handleLogout }) => (
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
          <button 
            onClick={() => navigate("/leaderboard")}
            className="w-full text-left px-4 py-2 text-white hover:bg-white/20 flex items-center space-x-2"
          >
            <Award className="w-4 h-4" />
            <span>Leaderboard</span>
          </button>
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
);

export default UserMenu; 