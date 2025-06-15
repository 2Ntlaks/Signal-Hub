import React, { useState, useEffect } from "react";
import {
  Users,
  Search,
  Filter,
  MoreVertical,
  Crown,
  TrendingUp,
  Ban,
  CheckCircle,
  DollarSign,
  Loader,
  AlertCircle,
} from "lucide-react";
import { supabaseHelpers } from "../../lib/supabase";

const UserManagement = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterType, setFilterType] = useState("all");

  useEffect(() => {
    const fetchUserData = async () => {
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

        // Process the data to combine user profiles with their progress
        const processedUsers = profiles.map((user) => {
          const userProgress = progress.filter((p) => p.user_id === user.id);
          const completedChapters = userProgress.filter(
            (p) => p.progress_percentage === 100
          ).length;
          // Assuming premium tier costs something, otherwise totalSpent would need a separate table
          const totalSpent = user.tier === "premium" ? 150 : 0; // Example value

          return {
            ...user,
            chaptersCompleted: completedChapters,
            totalSpent: totalSpent,
            lastActive: user.updated_at
              ? new Date(user.updated_at).toLocaleDateString()
              : "N/A",
            joinDate: new Date(user.created_at).toLocaleDateString(),
            // A simple logic for status, you might want a more robust one
            status: "active",
          };
        });

        setUsers(processedUsers);
      } catch (err) {
        setError(err.message || "Failed to fetch user data.");
        console.error("Error fetching user data:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, []);

  const filteredUsers = users.filter((user) => {
    const name = user.name || "";
    const email = user.email || "";
    const matchesSearch =
      name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter =
      filterType === "all" ||
      user.tier === filterType ||
      user.status === filterType;
    return matchesSearch && matchesFilter;
  });

  const stats = {
    total: users.length,
    premium: users.filter((u) => u.tier === "premium").length,
    free: users.filter((u) => u.tier === "free").length,
    active: users.filter((u) => u.status === "active").length,
    revenue: users.reduce((sum, u) => sum + u.totalSpent, 0),
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader className="h-8 w-8 animate-spin text-blue-600" />
        <p className="ml-2 text-gray-600">Loading user data...</p>
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

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h2 className="text-3xl font-bold text-gray-900 mb-2">
          User Management
        </h2>
        <p className="text-gray-600">
          Manage your platform users and subscriptions
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
        <div className="bg-white rounded-xl border border-gray-100 shadow-lg p-6">
          <p className="text-sm font-medium text-gray-600">Total Users</p>
          <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
        </div>
        <div className="bg-white rounded-xl border border-gray-100 shadow-lg p-6">
          <p className="text-sm font-medium text-gray-600">Premium Users</p>
          <p className="text-2xl font-bold text-purple-600">{stats.premium}</p>
        </div>
        <div className="bg-white rounded-xl border border-gray-100 shadow-lg p-6">
          <p className="text-sm font-medium text-gray-600">Free Users</p>
          <p className="text-2xl font-bold text-green-600">{stats.free}</p>
        </div>
        <div className="bg-white rounded-xl border border-gray-100 shadow-lg p-6">
          <p className="text-sm font-medium text-gray-600">Active Users</p>
          <p className="text-2xl font-bold text-blue-600">{stats.active}</p>
        </div>
        <div className="bg-white rounded-xl border border-gray-100 shadow-lg p-6">
          <p className="text-sm font-medium text-gray-600">Total Revenue</p>
          <p className="text-2xl font-bold text-green-600">R {stats.revenue}</p>
        </div>
      </div>

      {/* Filters and Search */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-lg p-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0">
          <div className="relative">
            <Search className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search users by name or email..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent w-full md:w-80"
            />
          </div>
          <div className="flex items-center space-x-4">
            <Filter className="h-5 w-5 text-gray-400" />
            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
              className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="all">All Users</option>
              <option value="premium">Premium</option>
              <option value="free">Free</option>
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
            </select>
          </div>
        </div>
      </div>

      {/* Users Table */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  User
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Plan
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Progress
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Join Date
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filteredUsers.map((user) => (
                <tr
                  key={user.id}
                  className="hover:bg-gray-50 transition-colors duration-300"
                >
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">
                      {user.name}
                    </div>
                    <div className="text-sm text-gray-500">{user.email}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span
                      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        user.tier === "premium"
                          ? "bg-purple-100 text-purple-800"
                          : "bg-gray-100 text-gray-800"
                      }`}
                    >
                      {user.tier}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">
                      {user.chaptersCompleted}/7 chapters
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {user.joinDate}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span
                      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        user.status === "active"
                          ? "bg-green-100 text-green-800"
                          : "bg-red-100 text-red-800"
                      }`}
                    >
                      {user.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <button className="text-gray-400 hover:text-gray-600 p-1 rounded">
                      <MoreVertical className="h-4 w-4" />
                    </button>
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

export default UserManagement;
