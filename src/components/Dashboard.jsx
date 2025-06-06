import React from "react";
import { TrendingUp, Star, Award, Clock } from "lucide-react";

const Dashboard = ({ user, chapters }) => {
  // Add null checks to prevent errors during loading
  if (!user || !chapters) {
    return (
      <div className="space-y-8">
        <div className="text-center py-12">
          <div className="w-16 h-16 bg-gradient-to-br from-blue-600 to-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-4 animate-pulse">
            <span className="text-white font-bold text-xl">🎓</span>
          </div>
          <h2 className="text-xl font-semibold text-gray-900 mb-2">
            Loading your dashboard...
          </h2>
          <p className="text-gray-600">
            Preparing your personalized experience
          </p>
        </div>
      </div>
    );
  }

  const totalChapters = chapters.length;
  const completedChapters = user.completedChapters?.length || 0;
  const progressPercentage =
    totalChapters > 0 ? (completedChapters / totalChapters) * 100 : 0;
  const userBookmarks = user.bookmarks?.length || 0;

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
                Welcome back, {user.name?.split(" ")[0] || "Student"}! 👋
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
              {userBookmarks}
            </span>
          </div>
          <h3 className="font-semibold text-gray-900 mb-1">Bookmarked</h3>
          <p className="text-gray-500 text-sm">Saved for quick access</p>
          <div className="mt-3 flex space-x-1">
            {[...Array(5)].map((_, i) => (
              <div
                key={i}
                className={`h-2 w-full rounded-full ${
                  i < userBookmarks
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
              {user.tier || "free"}
            </span>
          </div>
          <h3 className="font-semibold text-gray-900 mb-1">Current Plan</h3>
          <p className="text-gray-500 text-sm">
            {(user.tier || "free") === "free"
              ? "Limited access to content"
              : "Full access to all content"}
          </p>
          {(user.tier || "free") === "free" && (
            <button className="mt-3 w-full bg-gradient-to-r from-green-500 to-emerald-500 text-white py-2 rounded-lg hover:from-green-600 hover:to-emerald-600 transition-all duration-300 text-sm font-medium">
              Upgrade Now
            </button>
          )}
        </div>
      </div>

      {/* Continue Learning Section */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-lg p-8">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="text-2xl font-bold text-gray-900 mb-2">
              Continue Learning 📚
            </h3>
            <p className="text-gray-600">Pick up where you left off</p>
          </div>
          <button className="bg-gradient-to-r from-blue-500 to-purple-500 text-white px-6 py-3 rounded-xl hover:from-blue-600 hover:to-purple-600 transition-all duration-300 font-medium shadow-lg hover:shadow-xl">
            View All Chapters
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {chapters.slice(0, 4).map((chapter, index) => (
            <div
              key={chapter.id}
              className="group relative bg-gradient-to-br from-gray-50 to-white border border-gray-100 rounded-xl p-6 hover:shadow-lg transition-all duration-300 cursor-pointer hover:-translate-y-1"
            >
              {/* Chapter Number Badge */}
              <div className="absolute -top-2 -right-2 w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-500 text-white rounded-full flex items-center justify-center text-sm font-bold shadow-lg">
                {chapter.order}
              </div>

              <div className="flex justify-between items-start mb-3">
                <span className="bg-gradient-to-r from-blue-100 to-purple-100 text-blue-800 px-3 py-1 rounded-full text-xs font-medium">
                  Chapter {chapter.order}
                </span>
                {(user.completedChapters || []).includes(chapter.id) && (
                  <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
                    <span className="text-white text-xs font-bold">✓</span>
                  </div>
                )}
              </div>

              <h4 className="font-bold text-gray-900 mb-2 group-hover:text-blue-600 transition-colors duration-300">
                {chapter.title}
              </h4>
              <p className="text-gray-600 text-sm line-clamp-2 mb-4">
                {chapter.description}
              </p>

              {/* Progress indicator */}
              <div className="flex items-center space-x-2 text-xs text-gray-500">
                <div className="flex space-x-1">
                  <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                  <div className="w-2 h-2 bg-gray-300 rounded-full"></div>
                  <div className="w-2 h-2 bg-gray-300 rounded-full"></div>
                </div>
                <span>Ready to start</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
