import React from "react";
import { BookOpen, Menu, User, Zap } from "lucide-react";

const Header = ({ user, onMenuToggle }) => {
  // Add null checks to prevent errors during loading
  if (!user) {
    return (
      <header className="bg-white/80 backdrop-blur-lg shadow-sm border-b border-gray-100 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <div className="bg-gradient-to-br from-blue-600 to-purple-600 p-3 rounded-xl mr-4 shadow-lg">
                <BookOpen className="h-6 w-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
                  CPUT Signal Processing Hub
                </h1>
                <p className="text-xs text-gray-500 hidden sm:block">
                  Loading your profile...
                </p>
              </div>
            </div>
          </div>
        </div>
      </header>
    );
  }

  return (
    <header className="bg-white/80 backdrop-blur-lg shadow-sm border-b border-gray-100 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center">
            <button
              onClick={onMenuToggle}
              className="md:hidden p-2 rounded-xl text-gray-600 hover:text-gray-900 hover:bg-gray-100 transition-all duration-300"
            >
              <Menu className="h-6 w-6" />
            </button>
            <div className="flex items-center ml-2 md:ml-0">
              <div className="bg-gradient-to-br from-blue-600 to-purple-600 p-3 rounded-xl mr-4 shadow-lg">
                <BookOpen className="h-6 w-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
                  CPUT Signal Processing Hub
                </h1>
                <p className="text-xs text-gray-500 hidden sm:block">
                  Master Signal Processing with CPUT-specific resources ⚡
                </p>
              </div>
            </div>
          </div>

          <div className="flex items-center space-x-4">
            {user.tier === "free" && (
              <button className="group relative bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 text-white px-6 py-2.5 rounded-xl text-sm font-medium hover:shadow-lg transition-all duration-300 overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-r from-pink-600 via-purple-600 to-blue-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                <div className="relative flex items-center space-x-2">
                  <Zap className="h-4 w-4" />
                  <span>Upgrade to Premium</span>
                </div>
              </button>
            )}
            <div className="flex items-center space-x-3 bg-gray-50 rounded-xl px-4 py-2 hover:bg-gray-100 transition-colors duration-300 cursor-pointer">
              <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-purple-600 rounded-lg flex items-center justify-center shadow-sm">
                <User className="h-4 w-4 text-white" />
              </div>
              <div className="hidden sm:block">
                <p className="text-sm font-semibold text-gray-900">
                  {user.name || "Student"}
                </p>
                <p className="text-xs text-gray-500 capitalize flex items-center space-x-1">
                  <span>{user.tier || "free"} Plan</span>
                  {user.tier === "premium" && (
                    <span className="text-yellow-500">👑</span>
                  )}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
