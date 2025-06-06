import React, { useState } from "react";
import {
  TrendingUp,
  Users,
  DollarSign,
  BookOpen,
  Calendar,
  Download,
  Eye,
  Clock,
  Target,
  ArrowUp,
  ArrowDown,
} from "lucide-react";

const Analytics = () => {
  const [timeRange, setTimeRange] = useState("30d");

  // Mock analytics data
  const analytics = {
    overview: {
      totalRevenue: 47500,
      revenueGrowth: 15.2,
      activeUsers: 1247,
      userGrowth: 8.5,
      chapterViews: 8420,
      viewsGrowth: 12.3,
      conversionRate: 4.2,
      conversionGrowth: -2.1,
    },
    revenueData: [
      { month: "Jan", revenue: 32000, users: 980 },
      { month: "Feb", revenue: 38000, users: 1050 },
      { month: "Mar", revenue: 42000, users: 1150 },
      { month: "Apr", revenue: 45000, users: 1200 },
      { month: "May", revenue: 47500, users: 1247 },
    ],
    chapterStats: [
      {
        id: 1,
        title: "Introduction to Signals & Systems",
        views: 1240,
        completions: 890,
        rating: 4.8,
      },
      {
        id: 2,
        title: "Linear Time-Invariant Systems",
        views: 1100,
        completions: 780,
        rating: 4.7,
      },
      {
        id: 3,
        title: "Fourier Series Representation",
        views: 950,
        completions: 420,
        rating: 4.6,
      },
      {
        id: 4,
        title: "Continuous-Time Fourier Transform",
        views: 800,
        completions: 320,
        rating: 4.5,
      },
      {
        id: 5,
        title: "The Laplace Transform",
        views: 650,
        completions: 280,
        rating: 4.4,
      },
    ],
    userActivity: [
      { day: "Mon", active: 180, new: 12 },
      { day: "Tue", active: 220, new: 18 },
      { day: "Wed", active: 250, new: 15 },
      { day: "Thu", active: 210, new: 22 },
      { day: "Fri", active: 280, new: 25 },
      { day: "Sat", active: 190, new: 8 },
      { day: "Sun", active: 160, new: 5 },
    ],
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-bold text-gray-900 mb-2">
            Analytics Dashboard
          </h2>
          <p className="text-gray-600">
            Track your platform's performance and growth
          </p>
        </div>
        <div className="flex items-center space-x-4">
          <select
            value={timeRange}
            onChange={(e) => setTimeRange(e.target.value)}
            className="border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="7d">Last 7 days</option>
            <option value="30d">Last 30 days</option>
            <option value="90d">Last 90 days</option>
            <option value="1y">Last year</option>
          </select>
          <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors duration-300 flex items-center space-x-2">
            <Download className="h-4 w-4" />
            <span>Export Report</span>
          </button>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white rounded-2xl border border-gray-100 shadow-lg p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-green-50 rounded-xl flex items-center justify-center">
              <DollarSign className="h-6 w-6 text-green-600" />
            </div>
            <div
              className={`flex items-center space-x-1 text-sm font-medium ${
                analytics.overview.revenueGrowth > 0
                  ? "text-green-600"
                  : "text-red-600"
              }`}
            >
              {analytics.overview.revenueGrowth > 0 ? (
                <ArrowUp className="h-4 w-4" />
              ) : (
                <ArrowDown className="h-4 w-4" />
              )}
              <span>{Math.abs(analytics.overview.revenueGrowth)}%</span>
            </div>
          </div>
          <h3 className="text-2xl font-bold text-gray-900 mb-1">
            R {analytics.overview.totalRevenue.toLocaleString()}
          </h3>
          <p className="text-gray-600 text-sm">Total Revenue</p>
        </div>

        <div className="bg-white rounded-2xl border border-gray-100 shadow-lg p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-blue-50 rounded-xl flex items-center justify-center">
              <Users className="h-6 w-6 text-blue-600" />
            </div>
            <div
              className={`flex items-center space-x-1 text-sm font-medium ${
                analytics.overview.userGrowth > 0
                  ? "text-green-600"
                  : "text-red-600"
              }`}
            >
              {analytics.overview.userGrowth > 0 ? (
                <ArrowUp className="h-4 w-4" />
              ) : (
                <ArrowDown className="h-4 w-4" />
              )}
              <span>{Math.abs(analytics.overview.userGrowth)}%</span>
            </div>
          </div>
          <h3 className="text-2xl font-bold text-gray-900 mb-1">
            {analytics.overview.activeUsers.toLocaleString()}
          </h3>
          <p className="text-gray-600 text-sm">Active Users</p>
        </div>

        <div className="bg-white rounded-2xl border border-gray-100 shadow-lg p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-purple-50 rounded-xl flex items-center justify-center">
              <Eye className="h-6 w-6 text-purple-600" />
            </div>
            <div
              className={`flex items-center space-x-1 text-sm font-medium ${
                analytics.overview.viewsGrowth > 0
                  ? "text-green-600"
                  : "text-red-600"
              }`}
            >
              {analytics.overview.viewsGrowth > 0 ? (
                <ArrowUp className="h-4 w-4" />
              ) : (
                <ArrowDown className="h-4 w-4" />
              )}
              <span>{Math.abs(analytics.overview.viewsGrowth)}%</span>
            </div>
          </div>
          <h3 className="text-2xl font-bold text-gray-900 mb-1">
            {analytics.overview.chapterViews.toLocaleString()}
          </h3>
          <p className="text-gray-600 text-sm">Chapter Views</p>
        </div>

        <div className="bg-white rounded-2xl border border-gray-100 shadow-lg p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-orange-50 rounded-xl flex items-center justify-center">
              <Target className="h-6 w-6 text-orange-600" />
            </div>
            <div
              className={`flex items-center space-x-1 text-sm font-medium ${
                analytics.overview.conversionGrowth > 0
                  ? "text-green-600"
                  : "text-red-600"
              }`}
            >
              {analytics.overview.conversionGrowth > 0 ? (
                <ArrowUp className="h-4 w-4" />
              ) : (
                <ArrowDown className="h-4 w-4" />
              )}
              <span>{Math.abs(analytics.overview.conversionGrowth)}%</span>
            </div>
          </div>
          <h3 className="text-2xl font-bold text-gray-900 mb-1">
            {analytics.overview.conversionRate}%
          </h3>
          <p className="text-gray-600 text-sm">Conversion Rate</p>
        </div>
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Revenue Chart */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-lg p-6">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-lg font-semibold text-gray-900">
              Revenue Trend
            </h3>
            <div className="flex items-center space-x-2 text-sm text-gray-500">
              <Calendar className="h-4 w-4" />
              <span>Monthly</span>
            </div>
          </div>
          <div className="h-64 flex items-end justify-between space-x-2">
            {analytics.revenueData.map((data, index) => (
              <div key={index} className="flex-1 flex flex-col items-center">
                <div
                  className="w-full bg-gradient-to-t from-blue-500 to-blue-300 rounded-t-lg mb-2 transition-all duration-500 hover:from-blue-600 hover:to-blue-400"
                  style={{ height: `${(data.revenue / 50000) * 200}px` }}
                  title={`${data.month}: R ${data.revenue.toLocaleString()}`}
                />
                <span className="text-xs text-gray-600 font-medium">
                  {data.month}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* User Activity Chart */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-lg p-6">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-lg font-semibold text-gray-900">
              Daily Active Users
            </h3>
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                <span className="text-xs text-gray-600">Active</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                <span className="text-xs text-gray-600">New</span>
              </div>
            </div>
          </div>
          <div className="h-64 flex items-end justify-between space-x-1">
            {analytics.userActivity.map((data, index) => (
              <div
                key={index}
                className="flex-1 flex flex-col items-center space-y-1"
              >
                <div className="w-full flex flex-col space-y-1">
                  <div
                    className="w-full bg-gradient-to-t from-blue-500 to-blue-300 rounded-t-sm"
                    style={{ height: `${(data.active / 300) * 180}px` }}
                    title={`${data.day}: ${data.active} active users`}
                  />
                  <div
                    className="w-full bg-gradient-to-t from-green-500 to-green-300 rounded-t-sm"
                    style={{ height: `${(data.new / 30) * 40}px` }}
                    title={`${data.day}: ${data.new} new users`}
                  />
                </div>
                <span className="text-xs text-gray-600 font-medium">
                  {data.day}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Chapter Performance */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-lg p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-6">
          Chapter Performance
        </h3>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Chapter
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Views
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Completions
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Completion Rate
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Rating
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Performance
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {analytics.chapterStats.map((chapter, index) => {
                const completionRate =
                  (chapter.completions / chapter.views) * 100;
                return (
                  <tr
                    key={chapter.id}
                    className="hover:bg-gray-50 transition-colors duration-300"
                  >
                    <td className="px-4 py-4">
                      <div className="flex items-center space-x-3">
                        <span className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-500 text-white rounded-lg flex items-center justify-center text-sm font-bold">
                          {index + 1}
                        </span>
                        <span className="text-sm font-medium text-gray-900">
                          {chapter.title}
                        </span>
                      </div>
                    </td>
                    <td className="px-4 py-4">
                      <div className="flex items-center space-x-2">
                        <Eye className="h-4 w-4 text-gray-400" />
                        <span className="text-sm text-gray-900">
                          {chapter.views.toLocaleString()}
                        </span>
                      </div>
                    </td>
                    <td className="px-4 py-4">
                      <div className="flex items-center space-x-2">
                        <TrendingUp className="h-4 w-4 text-green-500" />
                        <span className="text-sm text-gray-900">
                          {chapter.completions.toLocaleString()}
                        </span>
                      </div>
                    </td>
                    <td className="px-4 py-4">
                      <div className="flex items-center space-x-3">
                        <div className="w-16 bg-gray-200 rounded-full h-2">
                          <div
                            className={`h-2 rounded-full ${
                              completionRate > 70
                                ? "bg-green-500"
                                : completionRate > 40
                                ? "bg-yellow-500"
                                : "bg-red-500"
                            }`}
                            style={{ width: `${completionRate}%` }}
                          />
                        </div>
                        <span className="text-sm text-gray-900">
                          {completionRate.toFixed(1)}%
                        </span>
                      </div>
                    </td>
                    <td className="px-4 py-4">
                      <div className="flex items-center space-x-1">
                        <div className="flex space-x-1">
                          {[...Array(5)].map((_, i) => (
                            <div
                              key={i}
                              className={`w-3 h-3 rounded-full ${
                                i < Math.floor(chapter.rating)
                                  ? "bg-yellow-400"
                                  : "bg-gray-200"
                              }`}
                            />
                          ))}
                        </div>
                        <span className="text-sm text-gray-900 ml-2">
                          {chapter.rating}
                        </span>
                      </div>
                    </td>
                    <td className="px-4 py-4">
                      <span
                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          completionRate > 70
                            ? "bg-green-100 text-green-800"
                            : completionRate > 40
                            ? "bg-yellow-100 text-yellow-800"
                            : "bg-red-100 text-red-800"
                        }`}
                      >
                        {completionRate > 70
                          ? "Excellent"
                          : completionRate > 40
                          ? "Good"
                          : "Needs Improvement"}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Quick Insights */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-2xl border border-blue-200 p-6">
          <div className="flex items-center space-x-3 mb-4">
            <div className="w-10 h-10 bg-blue-500 rounded-xl flex items-center justify-center">
              <TrendingUp className="h-5 w-5 text-white" />
            </div>
            <h4 className="font-semibold text-blue-900">Growth Insight</h4>
          </div>
          <p className="text-blue-800 text-sm leading-relaxed">
            Premium subscriptions increased by 23% this month. Consider
            expanding premium content offerings.
          </p>
        </div>

        <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-2xl border border-green-200 p-6">
          <div className="flex items-center space-x-3 mb-4">
            <div className="w-10 h-10 bg-green-500 rounded-xl flex items-center justify-center">
              <BookOpen className="h-5 w-5 text-white" />
            </div>
            <h4 className="font-semibold text-green-900">
              Content Performance
            </h4>
          </div>
          <p className="text-green-800 text-sm leading-relaxed">
            Introduction to Signals has the highest completion rate. Use this
            format for new chapters.
          </p>
        </div>

        <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-2xl border border-purple-200 p-6">
          <div className="flex items-center space-x-3 mb-4">
            <div className="w-10 h-10 bg-purple-500 rounded-xl flex items-center justify-center">
              <Users className="h-5 w-5 text-white" />
            </div>
            <h4 className="font-semibold text-purple-900">User Behavior</h4>
          </div>
          <p className="text-purple-800 text-sm leading-relaxed">
            Users are most active on weekdays. Schedule new content releases
            accordingly.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Analytics;
