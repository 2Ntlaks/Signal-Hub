import React, { useState } from "react";
import {
  LayoutDashboard,
  BookOpen,
  Users,
  Settings,
  LogOut,
  Bell,
  Search,
  Menu,
  X,
  Shield,
} from "lucide-react";

const AdminLayout = ({ children, currentView, setCurrentView, onLogout }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const menuItems = [
    { id: "overview", label: "Overview", icon: LayoutDashboard },
    { id: "chapters", label: "Chapter Management", icon: BookOpen },
    { id: "users", label: "User Management", icon: Users },
    { id: "analytics", label: "Analytics", icon: LayoutDashboard },
    { id: "settings", label: "Settings", icon: Settings },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b sticky top-0 z-50">
        <div className="px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <button
                onClick={() => setSidebarOpen(!sidebarOpen)}
                className="md:hidden p-2 rounded-md text-gray-600 hover:text-gray-900 hover:bg-gray-100"
              >
                <Menu className="h-6 w-6" />
              </button>
              <div className="flex items-center ml-2 md:ml-0">
                <div className="bg-gradient-to-br from-blue-600 to-purple-600 p-2 rounded-lg mr-3">
                  <Shield className="h-6 w-6 text-white" />
                </div>
                <div>
                  <h1 className="text-xl font-bold text-gray-900">
                    Admin Dashboard
                  </h1>
                  <p className="text-xs text-gray-500 hidden sm:block">
                    CPUT Signal Processing Hub
                  </p>
                </div>
              </div>
            </div>

            <div className="flex items-center space-x-4">
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search..."
                  className="pl-9 pr-4 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent w-64 hidden md:block"
                />
              </div>

              <button className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg">
                <Bell className="h-5 w-5" />
              </button>

              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
                  <span className="text-white text-sm font-bold">NM</span>
                </div>
                <div className="hidden sm:block">
                  <p className="text-sm font-medium text-gray-900">
                    Ntlakanipho Mgaguli
                  </p>
                  <p className="text-xs text-gray-500">Administrator</p>
                </div>
              </div>

              <button
                onClick={onLogout}
                className="p-2 text-gray-600 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors duration-300"
              >
                <LogOut className="h-5 w-5" />
              </button>
            </div>
          </div>
        </div>
      </header>

      <div className="flex">
        {/* Sidebar */}
        <div
          className={`fixed left-0 top-0 h-full bg-white border-r w-64 transform transition-transform duration-300 ease-in-out z-40 ${
            sidebarOpen ? "translate-x-0" : "-translate-x-full"
          } md:translate-x-0 md:static md:z-auto pt-16`}
        >
          <div className="p-4 border-b md:hidden">
            <div className="flex justify-between items-center">
              <h2 className="font-semibold text-gray-900">Admin Menu</h2>
              <button
                onClick={() => setSidebarOpen(false)}
                className="p-1 rounded text-gray-600 hover:text-gray-900"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
          </div>

          <nav className="p-4">
            <ul className="space-y-2">
              {menuItems.map((item) => {
                const Icon = item.icon;
                return (
                  <li key={item.id}>
                    <button
                      onClick={() => {
                        setCurrentView(item.id);
                        setSidebarOpen(false);
                      }}
                      className={`w-full flex items-center space-x-3 px-3 py-2.5 rounded-lg text-left transition-colors ${
                        currentView === item.id
                          ? "bg-blue-50 text-blue-700 font-medium"
                          : "text-gray-700 hover:bg-gray-50"
                      }`}
                    >
                      <Icon className="h-5 w-5" />
                      <span>{item.label}</span>
                    </button>
                  </li>
                );
              })}
            </ul>
          </nav>
        </div>

        {/* Mobile overlay */}
        {sidebarOpen && (
          <div
            className="fixed inset-0 bg-black bg-opacity-50 z-30 md:hidden"
            onClick={() => setSidebarOpen(false)}
          />
        )}

        {/* Main Content */}
        <main className="flex-1 p-6 md:ml-0">{children}</main>
      </div>
    </div>
  );
};

export default AdminLayout;
