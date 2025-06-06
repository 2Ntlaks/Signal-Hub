import React, { useState } from "react";
import {
  ArrowLeft,
  FileText,
  Download,
  Eye,
  Clock,
  Star,
  CheckCircle,
  Trophy,
} from "lucide-react";
import { useAuth } from "../contexts/AuthContext";

const ChapterDetail = ({ chapter, onBack }) => {
  const [isCompleting, setIsCompleting] = useState(false);
  const {
    markChapterComplete,
    isChapterCompleted,
    toggleBookmark,
    isChapterBookmarked,
  } = useAuth();

  const isCompleted = isChapterCompleted(chapter.id);
  const isBookmarked = isChapterBookmarked(chapter.id);

  const handleCompleteChapter = async () => {
    if (isCompleting || isCompleted) return;

    setIsCompleting(true);

    try {
      const result = await markChapterComplete(chapter.id);
      if (result.error) {
        console.error("Completion error:", result.error);
        alert("Failed to mark chapter as complete. Please try again.");
      } else {
        console.log("🎉 Chapter completed!");
        // Show success message or animation
      }
    } catch (error) {
      console.error("Chapter completion error:", error);
      alert("Failed to mark chapter as complete. Please try again.");
    } finally {
      setIsCompleting(false);
    }
  };

  const handleBookmarkToggle = async () => {
    try {
      const result = await toggleBookmark(chapter.id);
      if (result.error) {
        console.error("Bookmark error:", result.error);
        alert("Failed to update bookmark. Please try again.");
      }
    } catch (error) {
      console.error("Bookmark toggle error:", error);
      alert("Failed to update bookmark. Please try again.");
    }
  };

  const materials = [
    {
      type: "notes",
      title: "Study Notes",
      description:
        "Comprehensive explanations with handwritten notes and detailed theory",
      icon: FileText,
      color: "blue",
      gradient: "from-blue-500 to-blue-600",
      bgGradient: "from-blue-50 to-blue-100",
    },
    {
      type: "solutions",
      title: "Past Paper Solutions",
      description:
        "Step-by-step solutions to CPUT exam questions with detailed explanations",
      icon: FileText,
      color: "green",
      gradient: "from-green-500 to-emerald-600",
      bgGradient: "from-green-50 to-emerald-100",
    },
    {
      type: "formulas",
      title: "Formula Reference",
      description:
        "Quick reference sheet with key formulas and important equations",
      icon: FileText,
      color: "purple",
      gradient: "from-purple-500 to-purple-600",
      bgGradient: "from-purple-50 to-purple-100",
    },
  ];

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      {/* Back Button */}
      <button
        onClick={onBack}
        className="group flex items-center space-x-2 text-gray-600 hover:text-blue-600 font-medium transition-all duration-300"
      >
        <div className="w-8 h-8 bg-gray-100 group-hover:bg-blue-100 rounded-lg flex items-center justify-center transition-colors duration-300">
          <ArrowLeft className="h-4 w-4" />
        </div>
        <span>Back to Chapters</span>
      </button>

      {/* Chapter Header */}
      <div className="relative bg-gradient-to-br from-blue-600 via-purple-600 to-indigo-700 rounded-3xl p-8 text-white overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-20">
          <div className="absolute top-0 left-0 w-64 h-64 bg-white rounded-full -translate-x-32 -translate-y-32 blur-3xl"></div>
          <div className="absolute bottom-0 right-0 w-96 h-96 bg-purple-300 rounded-full translate-x-48 translate-y-48 blur-3xl"></div>
        </div>

        <div className="relative z-10">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center space-x-4">
              <span className="bg-white bg-opacity-20 text-white px-4 py-2 rounded-full text-sm font-bold backdrop-blur-sm">
                Chapter {chapter.order}
              </span>
              <div className="flex items-center space-x-2">
                {isCompleted ? (
                  <div className="flex items-center space-x-2 bg-green-500 bg-opacity-20 px-3 py-1 rounded-full backdrop-blur-sm">
                    <Trophy className="h-4 w-4 text-yellow-300" />
                    <span className="text-sm font-medium">Completed!</span>
                  </div>
                ) : (
                  <div className="flex items-center space-x-2">
                    <Clock className="h-4 w-4 text-blue-300" />
                    <span className="text-sm font-medium">In Progress</span>
                  </div>
                )}
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex items-center space-x-3">
              <button
                onClick={handleBookmarkToggle}
                className={`p-2 rounded-lg backdrop-blur-sm transition-all duration-300 ${
                  isBookmarked
                    ? "bg-yellow-500 bg-opacity-20 text-yellow-300"
                    : "bg-white bg-opacity-20 text-white hover:bg-opacity-30"
                }`}
                title={isBookmarked ? "Remove bookmark" : "Add bookmark"}
              >
                <Star
                  className={`h-5 w-5 ${isBookmarked ? "fill-current" : ""}`}
                />
              </button>

              {!isCompleted && (
                <button
                  onClick={handleCompleteChapter}
                  disabled={isCompleting}
                  className="bg-green-500 bg-opacity-20 text-white px-4 py-2 rounded-lg backdrop-blur-sm hover:bg-opacity-30 transition-all duration-300 flex items-center space-x-2 disabled:opacity-50"
                >
                  <CheckCircle className="h-4 w-4" />
                  <span>
                    {isCompleting ? "Completing..." : "Mark Complete"}
                  </span>
                </button>
              )}
            </div>
          </div>

          <h1 className="text-4xl font-bold mb-4 leading-tight">
            {chapter.title}
          </h1>

          <p className="text-blue-100 text-lg leading-relaxed max-w-3xl">
            {chapter.description}
          </p>

          <div className="flex items-center space-x-6 mt-6 text-sm">
            <div className="flex items-center space-x-2">
              <Clock className="h-4 w-4" />
              <span>Est. 2-3 hours</span>
            </div>
            <div className="flex items-center space-x-2">
              <FileText className="h-4 w-4" />
              <span>{Object.keys(chapter.materials).length} Resources</span>
            </div>
            {isCompleted && (
              <div className="flex items-center space-x-2 text-green-300">
                <Trophy className="h-4 w-4" />
                <span>Completed</span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Materials Grid - Keep existing code */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {materials.map((material) => {
          const Icon = material.icon;
          const hasResource = chapter.materials[material.type];

          if (!hasResource) return null;

          return (
            <div
              key={material.type}
              className="group relative bg-white rounded-2xl border border-gray-100 shadow-lg hover:shadow-2xl transition-all duration-500 cursor-pointer overflow-hidden hover:-translate-y-2"
            >
              {/* Background Gradient */}
              <div
                className={`absolute inset-0 bg-gradient-to-br ${material.bgGradient} opacity-50 group-hover:opacity-70 transition-opacity duration-500`}
              ></div>

              {/* Floating Orb */}
              <div
                className={`absolute -top-4 -right-4 w-24 h-24 bg-gradient-to-br ${material.gradient} rounded-full opacity-20 blur-xl group-hover:opacity-30 transition-opacity duration-500`}
              ></div>

              <div className="relative z-10 p-8">
                {/* Icon */}
                <div
                  className={`w-16 h-16 bg-gradient-to-br ${material.gradient} rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300 shadow-lg`}
                >
                  <Icon className="h-8 w-8 text-white" />
                </div>

                {/* Content */}
                <h3 className="text-xl font-bold text-gray-900 mb-3">
                  {material.title}
                </h3>

                <p className="text-gray-600 text-sm mb-6 leading-relaxed">
                  {material.description}
                </p>

                {/* Action Buttons */}
                <div className="space-y-3">
                  <button
                    className={`w-full bg-gradient-to-r ${material.gradient} text-white py-3 rounded-xl hover:shadow-lg transition-all duration-300 font-medium flex items-center justify-center space-x-2`}
                  >
                    <Eye className="h-4 w-4" />
                    <span>View Content</span>
                  </button>

                  <button className="w-full bg-gray-100 text-gray-700 py-3 rounded-xl hover:bg-gray-200 transition-colors duration-300 font-medium flex items-center justify-center space-x-2">
                    <Download className="h-4 w-4" />
                    <span>Download PDF</span>
                  </button>
                </div>

                {/* File Info */}
                <div className="mt-4 flex items-center justify-between text-xs text-gray-500">
                  <span>PDF • 2.4 MB</span>
                  <span>Updated 2 days ago</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Study Tips Section - Keep existing code */}
      <div className="bg-gradient-to-r from-indigo-50 to-blue-50 rounded-2xl p-8 border border-indigo-100">
        <h3 className="text-2xl font-bold text-gray-900 mb-4">
          💡 Study Tips for This Chapter
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-3">
            <div className="flex items-start space-x-3">
              <div className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                <span className="text-white text-xs font-bold">1</span>
              </div>
              <p className="text-gray-700">
                Start with the theory notes to understand fundamental concepts
              </p>
            </div>
            <div className="flex items-start space-x-3">
              <div className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                <span className="text-white text-xs font-bold">2</span>
              </div>
              <p className="text-gray-700">
                Practice with past paper solutions to apply your knowledge
              </p>
            </div>
          </div>
          <div className="space-y-3">
            <div className="flex items-start space-x-3">
              <div className="w-6 h-6 bg-purple-500 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                <span className="text-white text-xs font-bold">3</span>
              </div>
              <p className="text-gray-700">
                Keep the formula sheet handy for quick reference
              </p>
            </div>
            <div className="flex items-start space-x-3">
              <div className="w-6 h-6 bg-purple-500 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                <span className="text-white text-xs font-bold">4</span>
              </div>
              <p className="text-gray-700">
                Use the Concept Explainer for any unclear terms
              </p>
            </div>
          </div>
        </div>

        {/* Completion Celebration */}
        {isCompleted && (
          <div className="mt-6 p-4 bg-green-50 border border-green-200 rounded-xl">
            <div className="flex items-center space-x-3">
              <Trophy className="h-8 w-8 text-yellow-500" />
              <div>
                <h4 className="font-bold text-green-900">
                  Congratulations! 🎉
                </h4>
                <p className="text-green-800 text-sm">
                  You've completed this chapter. Great work on your Signal
                  Processing journey!
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ChapterDetail;
