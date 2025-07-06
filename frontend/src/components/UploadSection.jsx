import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  Loader2, Upload, Link, FileVideo, Play, BookOpen 
} from "lucide-react";

const UploadSection = ({ 
  tab, 
  setTab, 
  videoURL, 
  setVideoURL, 
  file, 
  setFile, 
  loading, 
  handleURLUpload, 
  handleLocalUpload, 
  audioExtracted, 
  errorMessage, 
  handleGenerateQuiz 
}) => (
  <Card className="bg-white/10 backdrop-blur-sm border-white/20">
    <CardHeader>
      <CardTitle className="text-white flex items-center space-x-2">
        <Upload className="w-5 h-5" />
        <span>Create New Quiz</span>
      </CardTitle>
    </CardHeader>
    <CardContent className="space-y-6">
      <div className="flex space-x-1 bg-white/10 rounded-lg p-1">
        <button
          className={`flex-1 py-2 px-4 rounded-md font-medium transition-all duration-200 ${
            tab === "link" ? "bg-white text-purple-600" : "text-white hover:bg-white/10"
          }`}
          onClick={() => setTab("link")}
        >
          <Link className="w-4 h-4 inline mr-2" />
          YouTube Link
        </button>
        <button
          className={`flex-1 py-2 px-4 rounded-md font-medium transition-all duration-200 ${
            tab === "local" ? "bg-white text-purple-600" : "text-white hover:bg-white/10"
          }`}
          onClick={() => setTab("local")}
        >
          <FileVideo className="w-4 h-4 inline mr-2" />
          Upload Video
        </button>
      </div>

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
            {!audioExtracted ? (
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
            ) : (
              <div className="p-4 bg-green-500/20 border border-green-500/30 rounded-lg">
                <p className="text-green-200 text-sm flex items-center space-x-2">
                  <span>✓</span>
                  <span>Audio extracted successfully! Ready to generate quiz.</span>
                </p>
              </div>
            )}
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
            {!audioExtracted ? (
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
            ) : (
              <div className="p-4 bg-green-500/20 border border-green-500/30 rounded-lg">
                <p className="text-green-200 text-sm flex items-center space-x-2">
                  <span>✓</span>
                  <span>Audio extracted successfully! Ready to generate quiz.</span>
                </p>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>

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

      {audioExtracted && (
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
);

export default UploadSection; 