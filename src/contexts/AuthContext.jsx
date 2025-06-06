import React, { createContext, useContext, useState, useEffect } from "react";
import { supabaseHelpers, supabase } from "../lib/supabase";

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [userProgress, setUserProgress] = useState([]);
  const [userBookmarks, setUserBookmarks] = useState([]);

  // Initialize auth state
  // Initialize auth state
  // Initialize auth state
  useEffect(() => {
    const initializeAuth = async () => {
      try {
        console.log("🔍 Starting auth initialization...");

        // Simplified - just set loading false and let auth state change handle it
        setLoading(false);
      } catch (error) {
        console.error("❌ Auth initialization error:", error);
        setLoading(false);
      }
    };

    initializeAuth();

    // Listen for auth changes - this is what actually matters
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event, session) => {
      console.log("🔄 Auth state change:", event, session?.user?.email);

      if (event === "SIGNED_IN" && session?.user) {
        console.log("✅ User signed in, loading profile...");
        setUser(session.user);
        await loadUserData(session.user.id);
      } else if (event === "SIGNED_OUT" || !session?.user) {
        console.log("🚪 User signed out or no session");
        setUser(null);
        setProfile(null);
        setUserProgress([]);
        setUserBookmarks([]);
      }

      setLoading(false); // Always set loading false after auth state change
    });

    return () => subscription.unsubscribe();
  }, []);
  // Load user profile, progress, and bookmarks
  const loadUserData = async (userId) => {
    try {
      console.log("📊 Loading user data for:", userId);

      // Load profile
      const { data: profileData, error: profileError } =
        await supabaseHelpers.getProfile(userId);
      if (profileError) {
        console.warn("⚠️ Profile error:", profileError);
        // If profile doesn't exist, create a basic one
        if (profileError.code === "PGRST116") {
          // No rows returned
          console.log("🆕 Creating missing profile...");
          const user = await supabaseHelpers.getCurrentUser();
          if (user) {
            const { data: newProfile, error: createError } =
              await supabaseHelpers.createProfile(user.id, {
                name: user.user_metadata?.name || "Student",
                email: user.email,
                tier: "free",
                university: "CPUT",
                student_number: user.user_metadata?.student_number || "",
              });

            if (!createError && newProfile) {
              console.log("✅ Profile created:", newProfile);
              setProfile(newProfile);
            } else {
              console.error("❌ Profile creation failed:", createError);
            }
          }
        }
      } else if (profileData) {
        console.log("✅ Profile loaded:", profileData);
        setProfile(profileData);
      }

      // Load progress (with error handling)
      try {
        const { data: progressData, error: progressError } =
          await supabaseHelpers.getUserProgress(userId);
        if (progressError) {
          console.warn("⚠️ Progress error:", progressError);
          setUserProgress([]); // Set empty array instead of failing
        } else if (progressData) {
          console.log("✅ Progress loaded:", progressData.length, "items");
          setUserProgress(progressData);
        } else {
          setUserProgress([]);
        }
      } catch (err) {
        console.warn("Progress loading failed:", err);
        setUserProgress([]);
      }

      // Load bookmarks (with error handling)
      try {
        const { data: bookmarksData, error: bookmarksError } =
          await supabaseHelpers.getUserBookmarks(userId);
        if (bookmarksError) {
          console.warn("⚠️ Bookmarks error:", bookmarksError);
          setUserBookmarks([]); // Set empty array instead of failing
        } else if (bookmarksData) {
          console.log("✅ Bookmarks loaded:", bookmarksData.length, "items");
          setUserBookmarks(bookmarksData);
        } else {
          setUserBookmarks([]);
        }
      } catch (err) {
        console.warn("Bookmarks loading failed:", err);
        setUserBookmarks([]);
      }
    } catch (error) {
      console.error("❌ Error loading user data:", error);
    }
  };

  // Auth actions
  const signIn = async (email, password) => {
    console.log("🔐 Attempting sign in for:", email);
    const { data, error } = await supabaseHelpers.signIn(email, password);
    if (!error && data.user) {
      console.log("✅ Sign in successful");
      setUser(data.user);
      await loadUserData(data.user.id);
    } else {
      console.error("❌ Sign in failed:", error);
    }
    return { data, error };
  };

  const signUp = async (email, password, metadata) => {
    console.log("📝 Attempting sign up for:", email);
    const { data, error } = await supabaseHelpers.signUp(
      email,
      password,
      metadata
    );
    if (!error) {
      console.log("✅ Sign up successful");
    } else {
      console.error("❌ Sign up failed:", error);
    }
    return { data, error };
  };

  const signOut = async () => {
    console.log("🚪 Signing out...");
    const { error } = await supabaseHelpers.signOut();
    if (!error) {
      setUser(null);
      setProfile(null);
      setUserProgress([]);
      setUserBookmarks([]);
      console.log("✅ Sign out successful");
    } else {
      console.error("❌ Sign out failed:", error);
    }
    return { error };
  };

  // Progress actions
  const markChapterComplete = async (chapterId) => {
    if (!user) return { error: "User not authenticated" };

    console.log("✅ Marking chapter complete:", chapterId);
    const { data, error } = await supabaseHelpers.markChapterComplete(
      user.id,
      chapterId
    );
    if (!error) {
      await loadUserData(user.id); // Refresh user data
    }
    return { data, error };
  };

  const toggleBookmark = async (chapterId) => {
    if (!user) return { error: "User not authenticated" };

    console.log("⭐ Toggling bookmark:", chapterId);
    const { data, error, added, removed } =
      await supabaseHelpers.toggleBookmark(user.id, chapterId);
    if (!error) {
      await loadUserData(user.id); // Refresh user data
    }
    return { data, error, added, removed };
  };

  // Helper functions
  const isChapterCompleted = (chapterId) => {
    return userProgress.some(
      (progress) =>
        progress.chapter_id === chapterId &&
        progress.progress_percentage === 100
    );
  };

  const isChapterBookmarked = (chapterId) => {
    return userBookmarks.some((bookmark) => bookmark.chapter_id === chapterId);
  };

  const getCompletedChapterIds = () => {
    return userProgress
      .filter((progress) => progress.progress_percentage === 100)
      .map((progress) => progress.chapter_id);
  };

  const getBookmarkedChapterIds = () => {
    return userBookmarks.map((bookmark) => bookmark.chapter_id);
  };

  const value = {
    // State
    user,
    profile,
    loading,
    userProgress,
    userBookmarks,

    // Auth actions
    signIn,
    signUp,
    signOut,

    // Progress actions
    markChapterComplete,
    toggleBookmark,

    // Helper functions
    isChapterCompleted,
    isChapterBookmarked,
    getCompletedChapterIds,
    getBookmarkedChapterIds,

    // Refresh data
    refreshUserData: () => (user ? loadUserData(user.id) : null),

    // Debug functions
    setUser,
    setProfile,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
