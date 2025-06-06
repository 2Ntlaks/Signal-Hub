import React, { useState, useEffect } from "react";
import Header from "./components/Header";
import Sidebar from "./components/Sidebar";
import Dashboard from "./components/Dashboard";
import ChapterCard from "./components/ChapterCard";
import ChapterDetail from "./components/ChapterDetail";
import SearchComponent from "./components/SearchComponent";
import ConceptExplainer from "./components/ConceptExplainer";
import AdminLogin from "./components/admin/AdminLogin";
import AdminLayout from "./components/admin/AdminLayout";
import AdminOverview from "./components/admin/AdminOverview";
import ChapterManagement from "./components/admin/ChapterManagement";
import UserManagement from "./components/admin/UserManagement";
import Analytics from "./components/admin/Analytics";
import Settings from "./components/admin/Settings";
import StudentAuth from "./components/auth/StudentAuth";
import { AuthProvider, useAuth } from "./contexts/AuthContext";
import { useChapters } from "./hooks/useChapters";

// Main App Component (now with authentication)
const AppContent = () => {
  const [currentView, setCurrentView] = useState("dashboard");
  const [selectedChapter, setSelectedChapter] = useState(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [adminLoggedIn, setAdminLoggedIn] = useState(false);

  const {
    user,
    profile,
    loading: authLoading,
    signOut,
    getCompletedChapterIds,
    getBookmarkedChapterIds,
  } = useAuth(); // Add signOut here
  const {
    chapters,
    loading: chaptersLoading,
    addChapter,
    updateChapter,
    deleteChapter,
  } = useChapters();

  // Auto-detect admin users (moved to useEffect to prevent infinite re-renders)
  useEffect(() => {
    if (user && user.email === "ntlakaniphomgaguli210@gmail.com" && !isAdmin) {
      console.log("🔧 Admin user detected, redirecting to admin panel...");
      setIsAdmin(true);
      setAdminLoggedIn(true);
    }
  }, [user, isAdmin]);

  // Add this function for quick sign out
  const handleQuickSignOut = () => {
    console.log("🚪 Clearing session and reloading...");

    // Clear all browser storage
    localStorage.clear();
    sessionStorage.clear();

    // Clear any cookies
    document.cookie.split(";").forEach(function (c) {
      document.cookie = c
        .replace(/^ +/, "")
        .replace(/=.*/, "=;expires=" + new Date().toUTCString() + ";path=/");
    });

    // Force reload to fresh state
    window.location.href = window.location.origin;
  };

  const handleChapterClick = (chapter) => {
    setSelectedChapter(chapter);
    setCurrentView("chapter-detail");
  };

  const handleBackToChapters = () => {
    setSelectedChapter(null);
    setCurrentView("chapters");
  };

  const handleAdminLogout = () => {
    setAdminLoggedIn(false);
    setIsAdmin(false);
    setCurrentView("dashboard");
  };

  const handleStudentAuthSuccess = (user, profile) => {
    // User is now authenticated, the AuthContext will handle the state
    console.log("Student authenticated:", user, profile);
  };

  // Show loading while checking authentication
  if (authLoading || chaptersLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 bg-gradient-to-br from-blue-600 to-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-4 animate-pulse">
            <span className="text-white font-bold text-xl">🎓</span>
          </div>
          <h2 className="text-xl font-semibold text-gray-900 mb-2">
            Loading CPUT Signal Hub...
          </h2>
          <p className="text-gray-600 mb-4">
            Preparing your learning experience
          </p>

          {/* Current user info */}
          {user && (
            <div className="mb-4 p-3 bg-blue-50 rounded-lg">
              <p className="text-sm text-blue-800">
                Currently signed in as: <strong>{user.email}</strong>
              </p>
              <p className="text-xs text-blue-600">
                {user.email.includes("admin") ||
                user.email === "ntlakaniphomgaguli210@gmail.com"
                  ? "(Admin Account)"
                  : "(Student Account)"}
              </p>
            </div>
          )}

          {/* Debug info */}
          <div className="mt-4 text-sm text-gray-500">
            <p>Auth Loading: {authLoading ? "Yes" : "No"}</p>
            <p>Chapters Loading: {chaptersLoading ? "Yes" : "No"}</p>
            <p>User: {user ? user.email : "Not found"}</p>
            <p>Profile: {profile ? profile.name : "Not found"}</p>
          </div>

          {/* Action buttons */}
          <div className="space-y-2 mt-4">
            {user && (
              <button
                onClick={handleQuickSignOut}
                className="block mx-auto px-6 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 font-medium"
              >
                🚪 Sign Out & Test Student Login
              </button>
            )}

            <button
              onClick={() => window.location.reload()}
              className="block mx-auto px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              Refresh Page
            </button>

            <button
              onClick={() => {
                // Force stop loading to see what happens
                console.log("🔧 Force continuing...");
              }}
              className="block mx-auto px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
            >
              Force Continue (Skip Loading)
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Show student auth if not authenticated and not trying to access admin
  if (!user && !isAdmin) {
    return <StudentAuth onAuthSuccess={handleStudentAuthSuccess} />;
  }

  // Admin Panel Logic
  if (isAdmin && !adminLoggedIn) {
    return <AdminLogin onLogin={setAdminLoggedIn} />;
  }

  if (isAdmin && adminLoggedIn) {
    const renderAdminContent = () => {
      switch (currentView) {
        case "overview":
          return <AdminOverview chapters={chapters} />;
        case "chapters":
          return (
            <div className="space-y-8">
              <div className="text-center">
                <h2 className="text-3xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent mb-4">
                  📚 Course Chapters
                </h2>
                <p className="text-gray-600 text-lg max-w-2xl mx-auto">
                  Master Signal Processing with our comprehensive CPUT
                  curriculum. Each chapter builds upon the previous one.
                </p>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {chapters.map((chapter) => (
                  <ChapterCard
                    key={chapter.id}
                    chapter={chapter}
                    user={profile}
                    onChapterClick={handleChapterClick}
                    completedChapters={
                      getCompletedChapterIds ? getCompletedChapterIds() : []
                    }
                    bookmarkedChapters={
                      getBookmarkedChapterIds ? getBookmarkedChapterIds() : []
                    }
                  />
                ))}
              </div>
            </div>
          );
        case "users":
          return <UserManagement />;
        case "analytics":
          return <Analytics />;
        case "settings":
          return <Settings />;
        default:
          return <AdminOverview chapters={chapters} />;
      }
    };

    return (
      <AdminLayout
        currentView={currentView || "overview"}
        setCurrentView={setCurrentView}
        onLogout={handleAdminLogout}
      >
        {renderAdminContent()}
      </AdminLayout>
    );
  }

  // Student Interface (authenticated users)
  const renderContent = () => {
    switch (currentView) {
      case "dashboard":
        return <Dashboard user={profile} chapters={chapters} />;
      case "chapters":
        return (
          <div className="space-y-8">
            <div className="text-center">
              <h2 className="text-3xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent mb-4">
                📚 Course Chapters
              </h2>
              <p className="text-gray-600 text-lg max-w-2xl mx-auto">
                Master Signal Processing with our comprehensive CPUT curriculum.
                Each chapter builds upon the previous one.
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {chapters.map((chapter) => (
                <ChapterCard
                  key={chapter.id}
                  chapter={chapter}
                  user={profile}
                  onChapterClick={handleChapterClick}
                />
              ))}
            </div>
          </div>
        );
      case "chapter-detail":
        return (
          <ChapterDetail
            chapter={selectedChapter}
            onBack={handleBackToChapters}
          />
        );
      case "search":
        return <SearchComponent />;
      case "concept-explainer":
        return <ConceptExplainer />;
      default:
        return <Dashboard user={profile} chapters={chapters} />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header
        user={profile}
        onMenuToggle={() => setSidebarOpen(!sidebarOpen)}
      />

      <div className="flex">
        <Sidebar
          isOpen={sidebarOpen}
          onClose={() => setSidebarOpen(false)}
          currentView={currentView}
          setCurrentView={setCurrentView}
        />

        <main className="flex-1 p-6 md:ml-0">
          {renderContent()}

          {/* Admin Access Button - Hidden in production */}
          <button
            onClick={() => setIsAdmin(true)}
            className="fixed bottom-4 right-4 bg-red-600 text-white p-3 rounded-full shadow-lg hover:bg-red-700 transition-colors duration-300 text-sm font-medium z-50"
            title="Admin Access (Development Only)"
          >
            🔧 Admin
          </button>
        </main>
      </div>
    </div>
  );
};

// Wrap the entire app with AuthProvider

function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}

export default App;
