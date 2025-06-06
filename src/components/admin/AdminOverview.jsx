import React from "react";
import {
  Users,
  BookOpen,
  TrendingUp,
  DollarSign,
  Eye,
  Download,
  Star,
  Clock,
  ArrowUp,
  ArrowDown,
} from "lucide-react";

const AdminOverview = ({ chapters, users = [] }) => {
  const stats = [
    {
      title: "Total Users",
      value: "1,247",
      change: "+12%",
      changeType: "positive",
      icon: Users,
      color: "blue",
    },
    {
      title: "Active Chapters",
      value: chapters.length,
      change: "+2",
      changeType: "positive",
      icon: BookOpen,
      color: "green",
    },
    {
      title: "Monthly Revenue",
      value: "R 15,750",
      change: "+8%",
      changeType: "positive",
      icon: DollarSign,
      color: "purple",
    },
    {
      title: "Premium Users",
      value: "324",
      change: "-2%",
      changeType: "negative",
      icon: Star,
      color: "orange",
    },
  ];

  const recentActivity = [
    {
      user: "John Doe",
      action: "Completed Chapter 3",
      time: "2 hours ago",
      type: "completion",
    },
    {
      user: "Sarah Wilson",
      action: "Upgraded to Premium",
      time: "3 hours ago",
      type: "upgrade",
    },
    {
      user: "Mike Chen",
      action: "Downloaded PDF - Fourier Transform",
      time: "5 hours ago",
      type: "download",
    },
    {
      user: "Lisa Brown",
      action: "Started Chapter 1",
      time: "6 hours ago",
      type: "start",
    },
    {
      user: "David Lee",
      action: "Bookmarked Chapter 2",
      time: "8 hours ago",
      type: "bookmark",
    },
  ];

  const popularChapters = chapters.slice(0, 5).map((chapter, index) => ({
    ...chapter,
    views: Math.floor(Math.random() * 1000) + 100,
    completions: Math.floor(Math.random() * 200) + 50,
  }));

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h2 className="text-3xl font-bold text-gray-900 mb-2">
          Dashboard Overview
        </h2>
        <p className="text-gray-600">
          Welcome back, Ntlakanipho! Here's what's happening with your platform.
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <div
              key={index}
              className="bg-white rounded-2xl border border-gray-100 shadow-lg p-6 hover:shadow-xl transition-shadow duration-300"
            >
              <div className="flex items-center justify-between mb-4">
                <div
                  className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                    stat.color === "blue"
                      ? "bg-blue-50"
                      : stat.color === "green"
                      ? "bg-green-50"
                      : stat.color === "purple"
                      ? "bg-purple-50"
                      : "bg-orange-50"
                  }`}
                >
                  <Icon
                    className={`h-6 w-6 ${
                      stat.color === "blue"
                        ? "text-blue-600"
                        : stat.color === "green"
                        ? "text-green-600"
                        : stat.color === "purple"
                        ? "text-purple-600"
                        : "text-orange-600"
                    }`}
                  />
                </div>
                <div
                  className={`flex items-center space-x-1 text-sm font-medium ${
                    stat.changeType === "positive"
                      ? "text-green-600"
                      : "text-red-600"
                  }`}
                >
                  {stat.changeType === "positive" ? (
                    <ArrowUp className="h-4 w-4" />
                  ) : (
                    <ArrowDown className="h-4 w-4" />
                  )}
                  <span>{stat.change}</span>
                </div>
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-1">
                {stat.value}
              </h3>
              <p className="text-gray-600 text-sm">{stat.title}</p>
            </div>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Popular Chapters */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-lg p-6">
          <h3 className="text-xl font-bold text-gray-900 mb-6">
            Most Popular Chapters
          </h3>
          <div className="space-y-4">
            {popularChapters.map((chapter, index) => (
              <div
                key={chapter.id}
                className="flex items-center justify-between p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors duration-300"
              >
                <div className="flex items-center space-x-4">
                  <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-500 rounded-lg flex items-center justify-center">
                    <span className="text-white font-bold text-sm">
                      {index + 1}
                    </span>
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-900">
                      {chapter.title}
                    </h4>
                    <p className="text-sm text-gray-600">
                      Chapter {chapter.order}
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <div className="flex items-center space-x-4 text-sm text-gray-600">
                    <div className="flex items-center space-x-1">
                      <Eye className="h-4 w-4" />
                      <span>{chapter.views}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <TrendingUp className="h-4 w-4" />
                      <span>{chapter.completions}</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Activity */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-lg p-6">
          <h3 className="text-xl font-bold text-gray-900 mb-6">
            Recent Activity
          </h3>
          <div className="space-y-4">
            {recentActivity.map((activity, index) => (
              <div
                key={index}
                className="flex items-center space-x-4 p-3 hover:bg-gray-50 rounded-lg transition-colors duration-300"
              >
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center ${
                    activity.type === "completion"
                      ? "bg-green-100"
                      : activity.type === "upgrade"
                      ? "bg-purple-100"
                      : activity.type === "download"
                      ? "bg-blue-100"
                      : activity.type === "start"
                      ? "bg-orange-100"
                      : "bg-yellow-100"
                  }`}
                >
                  {activity.type === "completion" && (
                    <TrendingUp className="h-4 w-4 text-green-600" />
                  )}
                  {activity.type === "upgrade" && (
                    <Star className="h-4 w-4 text-purple-600" />
                  )}
                  {activity.type === "download" && (
                    <Download className="h-4 w-4 text-blue-600" />
                  )}
                  {activity.type === "start" && (
                    <BookOpen className="h-4 w-4 text-orange-600" />
                  )}
                  {activity.type === "bookmark" && (
                    <Star className="h-4 w-4 text-yellow-600" />
                  )}
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-900">
                    {activity.user}
                  </p>
                  <p className="text-sm text-gray-600">{activity.action}</p>
                </div>
                <div className="text-xs text-gray-500 flex items-center space-x-1">
                  <Clock className="h-3 w-3" />
                  <span>{activity.time}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-2xl border border-blue-100 p-6">
        <h3 className="text-xl font-bold text-gray-900 mb-4">Quick Actions</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <button className="bg-white p-4 rounded-xl shadow-sm hover:shadow-md transition-shadow duration-300 text-left">
            <BookOpen className="h-8 w-8 text-blue-600 mb-2" />
            <h4 className="font-semibold text-gray-900 mb-1">
              Add New Chapter
            </h4>
            <p className="text-sm text-gray-600">
              Create and publish new content
            </p>
          </button>

          <button className="bg-white p-4 rounded-xl shadow-sm hover:shadow-md transition-shadow duration-300 text-left">
            <Users className="h-8 w-8 text-green-600 mb-2" />
            <h4 className="font-semibold text-gray-900 mb-1">Manage Users</h4>
            <p className="text-sm text-gray-600">
              View and moderate user accounts
            </p>
          </button>

          <button className="bg-white p-4 rounded-xl shadow-sm hover:shadow-md transition-shadow duration-300 text-left">
            <TrendingUp className="h-8 w-8 text-purple-600 mb-2" />
            <h4 className="font-semibold text-gray-900 mb-1">View Analytics</h4>
            <p className="text-sm text-gray-600">Check platform performance</p>
          </button>
        </div>
      </div>
    </div>
  );
};

export default AdminOverview;
