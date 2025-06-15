import React, { useState } from "react";
import {
  Star,
  Lock,
  CheckCircle,
  FileText,
  Calculator,
  BookOpen,
} from "lucide-react";
import { useAuth } from "../contexts/AuthContext";

const ChapterCard = ({ chapter, user, onChapterClick }) => {
  const [isBookmarking, setIsBookmarking] = useState(false);
  const { toggleBookmark, isChapterCompleted, isChapterBookmarked } = useAuth();

  const isLocked = !chapter.isUnlocked && user?.tier === "free";
  const isCompleted = isChapterCompleted(chapter.id);
  const isBookmarked = isChapterBookmarked(chapter.id);

  const handleBookmarkToggle = async (e) => {
    e.stopPropagation(); // Prevent card click

    if (isBookmarking) return;

    setIsBookmarking(true);

    try {
      const result = await toggleBookmark(chapter.id);
      if (result.error) {
        console.error("Bookmark error:", result.error);
        alert("Failed to update bookmark. Please try again.");
      } else {
        console.log(
          result.added ? "⭐ Bookmark added!" : "❌ Bookmark removed!"
        );
      }
    } catch (error) {
      console.error("Bookmark toggle error:", error);
      alert("Failed to update bookmark. Please try again.");
    } finally {
      setIsBookmarking(false);
    }
  };

  return (
    <div
      className={`group relative bg-white rounded-2xl border border-gray-100 shadow-lg hover:shadow-2xl transition-all duration-500 cursor-pointer overflow-hidden ${
        isLocked ? "opacity-75" : "hover:-translate-y-2"
      }`}
      onClick={() => !isLocked && onChapterClick(chapter)}
    >
      {/* Background Pattern */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-50 via-white to-purple-50 opacity-60"></div>

      {/* Floating Gradient Orbs */}
      <div className="absolute -top-4 -right-4 w-24 h-24 bg-gradient-to-br from-blue-400 to-purple-400 rounded-full opacity-20 blur-xl group-hover:opacity-30 transition-opacity duration-500"></div>
      <div className="absolute -bottom-4 -left-4 w-32 h-32 bg-gradient-to-br from-purple-400 to-pink-400 rounded-full opacity-15 blur-2xl group-hover:opacity-25 transition-opacity duration-500"></div>

      <div className="relative z-10 p-6">
        {/* Header with badges */}
        <div className="flex justify-between items-start mb-4">
          <div className="flex items-center space-x-2">
            <span className="bg-gradient-to-r from-blue-500 to-purple-500 text-white px-3 py-1.5 rounded-full text-xs font-bold shadow-lg">
              Chapter {chapter.order}
            </span>
            {isCompleted && (
              <div className="flex items-center space-x-1 bg-green-100 text-green-700 px-2 py-1 rounded-full text-xs font-medium">
                <CheckCircle className="h-3 w-3" />
                <span>Completed</span>
              </div>
            )}
          </div>

          <div className="flex items-center space-x-2">
            {/* Interactive Bookmark Button */}
            {!isLocked && (
              <button
                onClick={handleBookmarkToggle}
                disabled={isBookmarking}
                className={`w-8 h-8 rounded-full flex items-center justify-center transition-all duration-300 ${
                  isBookmarked
                    ? "bg-yellow-100 hover:bg-yellow-200 scale-110"
                    : "bg-gray-100 hover:bg-yellow-50"
                } ${isBookmarking ? "animate-pulse" : "group-hover:scale-110"}`}
                title={isBookmarked ? "Remove bookmark" : "Add bookmark"}
              >
                <Star
                  className={`h-4 w-4 transition-colors duration-300 ${
                    isBookmarked
                      ? "text-yellow-500 fill-current"
                      : "text-gray-400"
                  }`}
                />
              </button>
            )}

            {isLocked && (
              <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center">
                <Lock className="h-4 w-4 text-gray-400" />
              </div>
            )}
          </div>
        </div>

        {/* Title */}
        <h3 className="text-lg font-bold text-gray-900 mb-3 group-hover:text-blue-600 transition-colors duration-300 line-clamp-2">
          {chapter.title}
        </h3>

        {/* Description */}
        <p className="text-gray-600 text-sm mb-4 line-clamp-3 leading-relaxed">
          {chapter.description}
        </p>

        {/* Materials Icons */}
        <div className="flex flex-wrap gap-2 mb-4">
          {chapter.materials?.notes && (
            <div className="flex items-center space-x-1 bg-blue-50 text-blue-700 px-3 py-1.5 rounded-lg text-xs font-medium group-hover:bg-blue-100 transition-colors duration-300">
              <BookOpen className="h-3 w-3" />
              <span>Study Notes</span>
            </div>
          )}
          {chapter.materials?.solutions && (
            <div className="flex items-center space-x-1 bg-green-50 text-green-700 px-3 py-1.5 rounded-lg text-xs font-medium group-hover:bg-green-100 transition-colors duration-300">
              <FileText className="h-3 w-3" />
              <span>Solutions</span>
            </div>
          )}
          {chapter.materials?.formulas && (
            <div className="flex items-center space-x-1 bg-purple-50 text-purple-700 px-3 py-1.5 rounded-lg text-xs font-medium group-hover:bg-purple-100 transition-colors duration-300">
              <Calculator className="h-3 w-3" />
              <span>Formulas</span>
            </div>
          )}
        </div>

        {/* Progress Indicator */}
        <div className="mb-4">
          {isCompleted ? (
            <div className="flex items-center space-x-2 text-green-600">
              <div className="w-full bg-green-100 rounded-full h-2">
                <div className="bg-green-500 h-2 rounded-full w-full"></div>
              </div>
              <span className="text-xs font-medium whitespace-nowrap">
                Complete!
              </span>
            </div>
          ) : (
            <div className="flex items-center space-x-2 text-gray-500">
              <div className="w-full bg-gray-100 rounded-full h-2">
                <div className="bg-blue-500 h-2 rounded-full w-1/4"></div>
              </div>
              <span className="text-xs font-medium whitespace-nowrap">
                Ready
              </span>
            </div>
          )}
        </div>

        {/* Action Area */}
        {isLocked ? (
          <div className="bg-gradient-to-r from-yellow-50 to-orange-50 border border-yellow-200 rounded-xl p-4">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-br from-yellow-400 to-orange-400 rounded-full flex items-center justify-center">
                <Lock className="h-5 w-5 text-white" />
              </div>
              <div>
                <p className="text-yellow-800 text-sm font-semibold">
                  Premium Content
                </p>
                <p className="text-yellow-700 text-xs">
                  Upgrade to unlock this chapter
                </p>
              </div>
            </div>
          </div>
        ) : (
          <div className="flex items-center justify-between">
            <div className="flex space-x-1">
              {[...Array(3)].map((_, i) => (
                <div
                  key={i}
                  className={`w-2 h-2 rounded-full ${
                    isCompleted
                      ? "bg-green-500"
                      : i === 0
                      ? "bg-blue-500"
                      : "bg-gray-300"
                  }`}
                />
              ))}
            </div>
            <span className="text-xs text-gray-500 font-medium group-hover:text-blue-600 transition-colors duration-300">
              {isCompleted ? "Review →" : "Start learning →"}
            </span>
          </div>
        )}
      </div>

      {/* Hover Effect Border */}
      <div className="absolute inset-0 rounded-2xl border-2 border-transparent group-hover:border-blue-200 transition-colors duration-300"></div>
    </div>
  );
};

export default ChapterCard;
