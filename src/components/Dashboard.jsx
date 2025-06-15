import React from "react";
import {
  TrendingUp,
  Star,
  Award,
  Clock,
  ArrowRight,
  BookOpen,
} from "lucide-react";
import { useAuth } from "../contexts/AuthContext";

const Dashboard = ({ chapters = [], loading: chaptersLoading = false }) => {
  const {
    profile,
    userProgress,
    userBookmarks,
    loading: authLoading,
    getCompletedChapterIds,
    getBookmarkedChapterIds,
    isChapterCompleted,
  } = useAuth();

  // Show loading state while auth or chapters are loading
  if (authLoading || chaptersLoading || !profile) {
    return (
      <div className="space-y-8 animate-pulse">
        <div className="relative overflow-hidden bg-gray-200 rounded-2xl p-8 h-48"></div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-gray-200 rounded-2xl p-6 h-36"></div>
          <div className="bg-gray-200 rounded-2xl p-6 h-36"></div>
          <div className="bg-gray-200 rounded-2xl p-6 h-36"></div>
        </div>
        <div className="bg-gray-200 rounded-2xl p-8 h-64"></div>
      </div>
    );
  }

  const totalChapters = chapters.length;
  const completedChapterIds = getCompletedChapterIds();
  const bookmarkedChapterIds = getBookmarkedChapterIds();
  const completedChapters = completedChapterIds.length;
  const bookmarkedCount = bookmarkedChapterIds.length;

  const progressPercentage =
    totalChapters > 0 ? (completedChapters / totalChapters) * 100 : 0;

  // Get next chapter to study
  const nextChapter = chapters.find(
    (chapter) => !isChapterCompleted(chapter.id)
  );

  // Get recently completed chapters
  const recentlyCompleted = chapters
    .filter((chapter) => isChapterCompleted(chapter.id))
    .slice(-3);

  return (
    <div className="space-y-8">
      {/* Hero Welcome Section */}
      <div className="relative overflow-hidden bg-gradient-to-br from-blue-600 via-purple-600 to-indigo-700 rounded-2xl p-8 text-white">
        <div className="absolute inset-0 bg-black opacity-10"></div>
        <div className="relative z-10">
          <div className="flex items-center space-x-3 mb-4">
            <div className="w-12 h-12 bg-white bg-opacity-20 rounded-full flex items-center justify-center backdrop-blur-sm">
              <Award className="h-6 w-6 text-white" />
            </div>
            <div>
              <h2 className="text-3xl font-bold">
                Welcome back, {profile.name?.split(" ")[0] || "Student"}! 👋
              </h2>
              <p className="text-blue-100 text-lg">
                Ready to master Signal Processing today?
              </p>
            </div>
          </div>

          {/* Progress Bar in Hero */}
          <div className="bg-white bg-opacity-20 rounded-full p-1 backdrop-blur-sm">
            <div className="bg-white bg-opacity-30 rounded-full px-4 py-2">
              <div className="flex justify-between items-center text-sm mb-1">
                <span>Course Progress</span>
                <span className="font-bold">
                  {Math.round(progressPercentage)}%
                </span>
              </div>
              <div className="bg-white bg-opacity-30 rounded-full h-2">
                <div
                  className="bg-gradient-to-r from-yellow-400 to-orange-400 rounded-full h-2 transition-all duration-700 ease-out"
                  style={{ width: `${progressPercentage}%` }}
                />
              </div>
            </div>
          </div>

          {/* Next Chapter CTA */}
          {nextChapter && (
            <div className="mt-4 bg-white bg-opacity-10 rounded-xl p-4 backdrop-blur-sm">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-blue-100 text-sm">Continue Learning</p>
                  <p className="text-white font-semibold">
                    Chapter {nextChapter.order}: {nextChapter.title}
                  </p>
                </div>
                <div className="flex items-center text-white">
                  <span className="text-sm mr-2">Continue</span>
                  <ArrowRight className="h-4 w-4" />
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Floating Elements */}
        <div className="absolute top-4 right-4 w-20 h-20 bg-white bg-opacity-10 rounded-full blur-xl"></div>
        <div className="absolute bottom-8 right-8 w-32 h-32 bg-purple-400 bg-opacity-20 rounded-full blur-2xl"></div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="group bg-white rounded-2xl border border-gray-100 shadow-lg hover:shadow-xl transition-all duration-300 p-6 hover:-translate-y-1">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
              <TrendingUp className="h-6 w-6 text-white" />
            </div>
            <span className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              {completedChapters}/{totalChapters}
            </span>
          </div>
          <h3 className="font-semibold text-gray-900 mb-1">
            Learning Progress
          </h3>
          <p className="text-gray-500 text-sm">Chapters completed</p>
          <div className="mt-3 bg-gray-100 rounded-full h-2">
            <div
              className="bg-gradient-to-r from-blue-500 to-purple-500 rounded-full h-2 transition-all duration-500"
              style={{ width: `${progressPercentage}%` }}
            />
          </div>
        </div>

        <div className="group bg-white rounded-2xl border border-gray-100 shadow-lg hover:shadow-xl transition-all duration-300 p-6 hover:-translate-y-1">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
              <Star className="h-6 w-6 text-white" />
            </div>
            <span className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
              {bookmarkedCount}
            </span>
          </div>
          <h3 className="font-semibold text-gray-900 mb-1">Bookmarked</h3>
          <p className="text-gray-500 text-sm">Saved for quick access</p>
          <div className="mt-3 flex space-x-1">
            {[...Array(Math.min(5, totalChapters))].map((_, i) => (
              <div
                key={i}
                className={`h-2 w-full rounded-full ${
                  i < bookmarkedCount
                    ? "bg-gradient-to-r from-purple-500 to-pink-500"
                    : "bg-gray-100"
                }`}
              />
            ))}
          </div>
        </div>

        <div className="group bg-white rounded-2xl border border-gray-100 shadow-lg hover:shadow-xl transition-all duration-300 p-6 hover:-translate-y-1">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-emerald-500 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
              <Clock className="h-5 w-5 text-white" />
            </div>
            <span className="text-3xl font-bold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent capitalize">
              {profile.tier || "free"}
            </span>
          </div>
          <h3 className="font-semibold text-gray-900 mb-1">Current Plan</h3>
          <p className="text-gray-500 text-sm">
            {(profile.tier || "free") === "free"
              ? "Limited access to content"
              : "Full access to all content"}
          </p>
          {(profile.tier || "free") === "free" && (
            <button className="mt-3 w-full bg-gradient-to-r from-green-500 to-emerald-500 text-white py-2 rounded-lg hover:from-green-600 hover:to-emerald-600 transition-all duration-300 text-sm font-medium">
              Upgrade Now
            </button>
          )}
        </div>
      </div>

      {/* Learning Activities */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Continue Learning Section */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-lg p-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">
                Continue Learning 📚
              </h3>
              <p className="text-gray-600">Pick up where you left off</p>
            </div>
            <BookOpen className="h-6 w-6 text-blue-500" />
          </div>

          <div className="space-y-4">
            {chapters.slice(0, 3).map((chapter) => {
              const completed = isChapterCompleted(chapter.id);
              return (
                <div
                  key={chapter.id}
                  className="group relative bg-gradient-to-br from-gray-50 to-white border border-gray-100 rounded-xl p-4 hover:shadow-md transition-all duration-300 cursor-pointer hover:-translate-y-1"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div
                        className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                          completed
                            ? "bg-green-100 text-green-600"
                            : "bg-blue-100 text-blue-600"
                        }`}
                      >
                        <span className="font-bold text-sm">
                          {chapter.order}
                        </span>
                      </div>
                      <div>
                        <h4 className="font-semibold text-gray-900 text-sm">
                          {chapter.title}
                        </h4>
                        <p className="text-gray-500 text-xs">
                          {completed ? "Completed" : "Ready to start"}
                        </p>
                      </div>
                    </div>
                    <ArrowRight className="h-4 w-4 text-gray-400 group-hover:text-blue-600 transition-colors duration-300" />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Recent Activity */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-lg p-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">
                Recent Activity ⚡
              </h3>
              <p className="text-gray-600">Your recent achievements</p>
            </div>
            <Award className="h-6 w-6 text-purple-500" />
          </div>

          <div className="space-y-4">
            {recentlyCompleted.length > 0 ? (
              recentlyCompleted.map((chapter) => (
                <div
                  key={chapter.id}
                  className="flex items-center space-x-3 p-3 bg-green-50 rounded-lg"
                >
                  <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                    <Award className="h-4 w-4 text-green-600" />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-900">
                      Completed Chapter {chapter.order}
                    </p>
                    <p className="text-xs text-gray-600">{chapter.title}</p>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-8">
                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <BookOpen className="h-8 w-8 text-gray-400" />
                </div>
                <p className="text-gray-600 text-sm">
                  Start learning to see your activity here
                </p>
              </div>
            )}

            {/* Study streak placeholder */}
            <div className="mt-6 p-4 bg-gradient-to-r from-orange-50 to-yellow-50 rounded-lg border border-orange-100">
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-orange-100 rounded-full flex items-center justify-center">
                  <span className="text-orange-600 font-bold text-sm">🔥</span>
                </div>
                <div>
                  <p className="text-sm font-medium text-orange-900">
                    Keep your streak going!
                  </p>
                  <p className="text-xs text-orange-700">
                    Complete a chapter today to maintain momentum
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
