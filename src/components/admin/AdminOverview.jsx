import React, { useState, useEffect } from "react";
import {
  Users,
  BookOpen,
  TrendingUp,
  DollarSign,
  Eye,
  Star,
  Clock,
  ArrowUp,
  Loader,
  AlertCircle,
} from "lucide-react";
import { supabaseHelpers } from "../../lib/supabase";

const AdminOverview = ({ chapters, user }) => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchOverviewData = async () => {
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

        // --- Process Data for Stats Cards ---
        const totalUsers = profiles.length;
        const premiumUsers = profiles.filter(
          (p) => p.tier === "premium"
        ).length;
        const totalRevenue = premiumUsers * 150; // Example calculation

        // --- Process Data for Popular Chapters ---
        const chapterInteractions = {};
        progress.forEach((p) => {
          if (!chapterInteractions[p.chapter_id]) {
            chapterInteractions[p.chapter_id] = { views: 0, completions: 0 };
          }
          chapterInteractions[p.chapter_id].views += 1;
          if (p.progress_percentage === 100) {
            chapterInteractions[p.chapter_id].completions += 1;
          }
        });

        const popularChapters = chapters
          .map((chapter) => ({
            ...chapter,
            views: chapterInteractions[chapter.id]?.views || 0,
            completions: chapterInteractions[chapter.id]?.completions || 0,
          }))
          .sort((a, b) => b.views - a.views)
          .slice(0, 5);

        // --- Process Data for Recent Activity ---
        const signUps = profiles.map((p) => ({
          type: "signup",
          text: `${p.name || "A new user"} has signed up.`,
          timestamp: new Date(p.created_at),
        }));

        const completions = progress
          .filter((p) => p.completed_at)
          .map((p) => {
            const profile = profiles.find(
              (profile) => profile.id === p.user_id
            );
            const chapter = chapters.find((c) => c.id === p.chapter_id);
            return {
              type: "completion",
              text: `${profile?.name || "A user"} completed Chapter ${
                chapter?.order || ""
              }: ${chapter?.title || ""}`,
              timestamp: new Date(p.completed_at),
            };
          });

        const recentActivity = [...signUps, ...completions]
          .sort((a, b) => b.timestamp - a.timestamp)
          .slice(0, 5)
          .map((activity) => ({
            ...activity,
            time: activity.timestamp.toLocaleString(),
          }));

        setStats({
          totalUsers,
          premiumUsers,
          totalRevenue,
          activeChapters: chapters.length,
          popularChapters,
          recentActivity,
        });
      } catch (err) {
        setError(err.message || "Failed to fetch overview data.");
        console.error("Error fetching overview data:", err);
      } finally {
        setLoading(false);
      }
    };

    if (chapters && chapters.length > 0) {
      fetchOverviewData();
    }
  }, [chapters]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader className="h-8 w-8 animate-spin text-blue-600" />
        <p className="ml-2 text-gray-600">Loading overview data...</p>
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

  if (!stats) {
    return <p>No data available to generate overview.</p>;
  }

  const statCards = [
    {
      title: "Total Users",
      value: stats.totalUsers,
      icon: Users,
      color: "blue",
    },
    {
      title: "Active Chapters",
      value: stats.activeChapters,
      icon: BookOpen,
      color: "green",
    },
    {
      title: "Monthly Revenue",
      value: `R ${stats.totalRevenue}`,
      icon: DollarSign,
      color: "purple",
    },
    {
      title: "Premium Users",
      value: stats.premiumUsers,
      icon: Star,
      color: "orange",
    },
  ];

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h2 className="text-3xl font-bold text-gray-900 mb-2">
          Dashboard Overview
        </h2>
        <p className="text-gray-600">
          Welcome back! Here's what's happening with your platform.
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((stat, index) => (
          <div
            key={index}
            className="bg-white rounded-2xl border border-gray-100 shadow-lg p-6"
          >
            <div
              className={`w-12 h-12 rounded-xl flex items-center justify-center bg-${stat.color}-50 mb-4`}
            >
              <stat.icon className={`h-6 w-6 text-${stat.color}-600`} />
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-1">
              {stat.value}
            </h3>
            <p className="text-gray-600 text-sm">{stat.title}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Popular Chapters */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-lg p-6">
          <h3 className="text-xl font-bold text-gray-900 mb-6">
            Most Popular Chapters
          </h3>
          <div className="space-y-4">
            {stats.popularChapters.map((chapter, index) => (
              <div
                key={chapter.id}
                className="flex items-center justify-between p-4 bg-gray-50 rounded-xl"
              >
                <div>
                  <h4 className="font-medium text-gray-900">{chapter.title}</h4>
                  <p className="text-sm text-gray-600">
                    Chapter {chapter.order}
                  </p>
                </div>
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
            ))}
          </div>
        </div>

        {/* Recent Activity */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-lg p-6">
          <h3 className="text-xl font-bold text-gray-900 mb-6">
            Recent Activity
          </h3>
          <div className="space-y-4">
            {stats.recentActivity.map((activity, index) => (
              <div key={index} className="flex items-center space-x-4 p-3">
                <div className="flex-1">
                  <p className="text-sm text-gray-800">{activity.text}</p>
                </div>
                <div className="text-xs text-gray-500">{activity.time}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminOverview;
