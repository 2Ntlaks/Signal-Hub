import React, { useState, useEffect } from "react";
import {
  TrendingUp,
  Users,
  DollarSign,
  BookOpen,
  Eye,
  Target,
  ArrowUp,
  Loader,
  AlertCircle,
} from "lucide-react";
import { supabaseHelpers } from "../../lib/supabase";
import { useChapters } from "../../hooks/useChapters";

const Analytics = () => {
  const [analyticsData, setAnalyticsData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { chapters } = useChapters(); // We'll get chapter titles from here

  useEffect(() => {
    const fetchAnalytics = async () => {
      setLoading(true);
      setError(null);
      try {
        const {
          users: profiles,
          progress,
          errors,
        } = await supabaseHelpers.getUserStats();

        if (errors.usersError || errors.progressError) {
          throw errors.usersError || errors.progressError;
        }

        // --- Process Data ---
        const totalUsers = profiles.length;
        const premiumUsers = profiles.filter(
          (p) => p.tier === "premium"
        ).length;
        const conversionRate =
          totalUsers > 0 ? ((premiumUsers / totalUsers) * 100).toFixed(1) : 0;

        // This is a proxy for views. Assumes one row in progress table is one view/interaction.
        const chapterViews = progress.length;

        // Calculate stats for each chapter
        const chapterStats = chapters.map((chapter) => {
          const views = progress.filter(
            (p) => p.chapter_id === chapter.id
          ).length;
          const completions = progress.filter(
            (p) => p.chapter_id === chapter.id && p.progress_percentage === 100
          ).length;
          const completionRate = views > 0 ? (completions / views) * 100 : 0;

          return {
            id: chapter.id,
            title: chapter.title,
            views,
            completions,
            completionRate,
          };
        });

        setAnalyticsData({
          totalUsers,
          premiumUsers,
          conversionRate,
          chapterViews,
          chapterStats,
          // Assuming a fixed value per premium user for revenue display
          totalRevenue: premiumUsers * 150,
        });
      } catch (err) {
        setError(err.message || "Failed to fetch analytics data.");
        console.error("Error fetching analytics data:", err);
      } finally {
        setLoading(false);
      }
    };

    if (chapters.length > 0) {
      fetchAnalytics();
    }
  }, [chapters]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader className="h-8 w-8 animate-spin text-blue-600" />
        <p className="ml-2 text-gray-600">Loading analytics data...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 p-4 rounded-lg flex items-center">
        <AlertCircle className="h-5 w-5 text-red-600 mr-2" />
        <p className="text-red-800">{error}</p>
      </div>
    );
  }

  if (!analyticsData) {
    return <p>No analytics data available.</p>;
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-bold text-gray-900 mb-2">
            Analytics Dashboard
          </h2>
          <p className="text-gray-600">
            Track your platform's performance and growth with live data.
          </p>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white rounded-2xl border border-gray-100 shadow-lg p-6">
          <DollarSign className="h-6 w-6 text-green-600 mb-4" />
          <h3 className="text-2xl font-bold text-gray-900 mb-1">
            R {analyticsData.totalRevenue.toLocaleString()}
          </h3>
          <p className="text-gray-600 text-sm">Total Revenue (Estimated)</p>
        </div>
        <div className="bg-white rounded-2xl border border-gray-100 shadow-lg p-6">
          <Users className="h-6 w-6 text-blue-600 mb-4" />
          <h3 className="text-2xl font-bold text-gray-900 mb-1">
            {analyticsData.totalUsers.toLocaleString()}
          </h3>
          <p className="text-gray-600 text-sm">Total Users</p>
        </div>
        <div className="bg-white rounded-2xl border border-gray-100 shadow-lg p-6">
          <Eye className="h-6 w-6 text-purple-600 mb-4" />
          <h3 className="text-2xl font-bold text-gray-900 mb-1">
            {analyticsData.chapterViews.toLocaleString()}
          </h3>
          <p className="text-gray-600 text-sm">Chapter Interactions</p>
        </div>
        <div className="bg-white rounded-2xl border border-gray-100 shadow-lg p-6">
          <Target className="h-6 w-6 text-orange-600 mb-4" />
          <h3 className="text-2xl font-bold text-gray-900 mb-1">
            {analyticsData.conversionRate}%
          </h3>
          <p className="text-gray-600 text-sm">Premium Conversion Rate</p>
        </div>
      </div>

      {/* Chapter Performance Table */}
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
                  Interactions (Views)
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Completions
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Completion Rate
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {analyticsData.chapterStats.map((chapter) => (
                <tr key={chapter.id} className="hover:bg-gray-50">
                  <td className="px-4 py-4 text-sm font-medium text-gray-900">
                    {chapter.title}
                  </td>
                  <td className="px-4 py-4 text-sm text-gray-900">
                    {chapter.views}
                  </td>
                  <td className="px-4 py-4 text-sm text-gray-900">
                    {chapter.completions}
                  </td>
                  <td className="px-4 py-4">
                    <div className="flex items-center space-x-3">
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div
                          className="h-2 rounded-full bg-blue-600"
                          style={{ width: `${chapter.completionRate}%` }}
                        />
                      </div>
                      <span className="text-sm text-gray-900">
                        {chapter.completionRate.toFixed(1)}%
                      </span>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Analytics;
