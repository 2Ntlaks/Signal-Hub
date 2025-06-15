import React, { useState, useEffect } from "react";
import { Toaster } from "react-hot-toast";
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
import UpdatePassword from "./components/auth/UpdatePassword";
import { AuthProvider, useAuth } from "./contexts/AuthContext";
import { useChapters } from "./hooks/useChapters";

// Main App Component
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
    isPasswordRecovery,
    signOut,
  } = useAuth();

  const {
    chapters,
    loading: chaptersLoading,
    error: chaptersError,
    addChapter,
    updateChapter,
    deleteChapter,
  } = useChapters();

  // Auto-detect admin users
  useEffect(() => {
    if (user && user.email === "ntlakaniphomgaguli210@gmail.com" && !isAdmin) {
      console.log("🔧 Admin user detected, redirecting to admin panel...");
      setIsAdmin(true);
      setAdminLoggedIn(true);
    }
  }, [user, isAdmin]);

  // Check for password recovery flow
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const type = urlParams.get("type");

    if (type === "recovery") {
      console.log("Password recovery flow detected");
      // The AuthContext will handle setting isPasswordRecovery
    }
  }, []);

  // Handle quick sign out for testing
  const handleQuickSignOut = async () => {
    console.log("🚪 Signing out...");
    try {
      await signOut();
      // Clear local state
      setIsAdmin(false);
      setAdminLoggedIn(false);
      setCurrentView("dashboard");
      // Clear URL parameters
      window.history.replaceState({}, document.title, window.location.pathname);
    } catch (error) {
      console.error("Sign out error:", error);
    }
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
    console.log("Student authenticated:", user?.email);
  };

  // Show password recovery component if in recovery flow
  if (isPasswordRecovery && user) {
    return <UpdatePassword />;
  }

  // Show loading while checking authentication
  if (authLoading) {
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
            <ChapterManagement
              chapters={chapters}
              addChapter={addChapter}
              updateChapter={updateChapter}
              deleteChapter={deleteChapter}
            />
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
    // Show error if chapters failed to load
    if (chaptersError) {
      return (
        <div className="max-w-2xl mx-auto mt-8 p-6 bg-red-50 border border-red-200 rounded-lg">
          <h3 className="text-lg font-semibold text-red-900 mb-2">
            Failed to Load Chapters
          </h3>
          <p className="text-red-700 mb-4">{chaptersError}</p>
          <button
            onClick={() => window.location.reload()}
            className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700"
          >
            Retry
          </button>
        </div>
      );
    }

    switch (currentView) {
      case "dashboard":
        return <Dashboard chapters={chapters} loading={chaptersLoading} />;
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

            {chaptersLoading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {[...Array(6)].map((_, i) => (
                  <div
                    key={i}
                    className="bg-gray-200 animate-pulse rounded-2xl h-64"
                  ></div>
                ))}
              </div>
            ) : (
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
            )}
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
        return <SearchComponent onChapterClick={handleChapterClick} />;
      case "concept-explainer":
        return <ConceptExplainer />;
      default:
        return <Dashboard chapters={chapters} loading={chaptersLoading} />;
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
          {process.env.NODE_ENV === "development" && !isAdmin && (
            <button
              onClick={() => setIsAdmin(true)}
              className="fixed bottom-4 right-4 bg-red-600 text-white p-3 rounded-full shadow-lg hover:bg-red-700 transition-colors duration-300 text-sm font-medium z-50"
              title="Admin Access (Development Only)"
            >
              🔧 Admin
            </button>
          )}
        </main>
      </div>

      {/* Toast notifications */}
      <Toaster
        position="top-right"
        toastOptions={{
          duration: 4000,
          style: {
            background: "#363636",
            color: "#fff",
          },
          success: {
            duration: 3000,
            theme: {
              primary: "green",
              secondary: "black",
            },
          },
        }}
      />
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
