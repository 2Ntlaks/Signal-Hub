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
  const [isPasswordRecovery, setIsPasswordRecovery] = useState(false);

  // User progress and bookmarks state
  const [userProgress, setUserProgress] = useState([]);
  const [userBookmarks, setUserBookmarks] = useState([]);
  const [progressLoading, setProgressLoading] = useState(false);

  useEffect(() => {
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event, session) => {
      console.log("Auth state changed:", event, session?.user?.email);

      if (event === "PASSWORD_RECOVERY") {
        setIsPasswordRecovery(true);
        setUser(session?.user ?? null);
        setLoading(false);
        return;
      }

      setIsPasswordRecovery(false);
      setUser(session?.user ?? null);

      if (session?.user) {
        await loadUserProfile(session.user.id);
        await loadUserProgressAndBookmarks(session.user.id);
      } else {
        setProfile(null);
        setUserProgress([]);
        setUserBookmarks([]);
      }
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  const loadUserProfile = async (userId) => {
    try {
      const { data, error } = await supabaseHelpers.getProfile(userId);
      if (error) {
        console.error("Error loading profile:", error);
        return;
      }
      setProfile(data);
    } catch (error) {
      console.error("Profile loading error:", error);
    }
  };

  const loadUserProgressAndBookmarks = async (userId) => {
    setProgressLoading(true);
    try {
      // Load user progress
      const { data: progressData, error: progressError } =
        await supabaseHelpers.getUserProgress(userId);
      if (!progressError) {
        setUserProgress(progressData || []);
      }

      // Load user bookmarks
      const { data: bookmarksData, error: bookmarksError } =
        await supabaseHelpers.getUserBookmarks(userId);
      if (!bookmarksError) {
        setUserBookmarks(bookmarksData || []);
      }
    } catch (error) {
      console.error("Error loading user data:", error);
    } finally {
      setProgressLoading(false);
    }
  };

  // Authentication methods
  const signIn = async (email, password) => {
    try {
      const result = await supabaseHelpers.signIn(email, password);
      return result;
    } catch (error) {
      console.error("SignIn error:", error);
      return { data: null, error };
    }
  };

  const signUp = async (email, password, metadata = {}) => {
    try {
      const result = await supabaseHelpers.signUp(email, password, metadata);
      return result;
    } catch (error) {
      console.error("SignUp error:", error);
      return { data: null, error };
    }
  };

  const signOut = async () => {
    try {
      const result = await supabaseHelpers.signOut();
      setUser(null);
      setProfile(null);
      setUserProgress([]);
      setUserBookmarks([]);
      return result;
    } catch (error) {
      console.error("SignOut error:", error);
      return { error };
    }
  };

  const resetPasswordForEmail = async (email) => {
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/update-password`,
      });
      return { error };
    } catch (error) {
      console.error("Password reset error:", error);
      return { error };
    }
  };

  const updateUserPassword = async (password) => {
    try {
      const { error } = await supabase.auth.updateUser({ password });
      return { error };
    } catch (error) {
      console.error("Password update error:", error);
      return { error };
    }
  };

  // Progress tracking methods
  const markChapterComplete = async (chapterId) => {
    if (!user) return { error: new Error("User not authenticated") };

    try {
      const result = await supabaseHelpers.markChapterComplete(
        user.id,
        chapterId
      );
      if (!result.error) {
        // Update local state
        await loadUserProgressAndBookmarks(user.id);
      }
      return result;
    } catch (error) {
      console.error("Mark chapter complete error:", error);
      return { error };
    }
  };

  const updateProgress = async (chapterId, progressData) => {
    if (!user) return { error: new Error("User not authenticated") };

    try {
      const result = await supabaseHelpers.updateProgress(
        user.id,
        chapterId,
        progressData
      );
      if (!result.error) {
        // Update local state
        await loadUserProgressAndBookmarks(user.id);
      }
      return result;
    } catch (error) {
      console.error("Update progress error:", error);
      return { error };
    }
  };

  // Bookmark methods
  const toggleBookmark = async (chapterId) => {
    if (!user) return { error: new Error("User not authenticated") };

    try {
      const result = await supabaseHelpers.toggleBookmark(user.id, chapterId);
      if (!result.error) {
        // Update local state
        await loadUserProgressAndBookmarks(user.id);
      }
      return result;
    } catch (error) {
      console.error("Toggle bookmark error:", error);
      return { error };
    }
  };

  // Helper methods for checking status
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

  const getChapterProgress = (chapterId) => {
    const progress = userProgress.find((p) => p.chapter_id === chapterId);
    return progress ? progress.progress_percentage : 0;
  };

  const value = {
    // Auth state
    user,
    profile,
    loading,
    isPasswordRecovery,
    progressLoading,

    // User data
    userProgress,
    userBookmarks,

    // Auth methods
    signIn,
    signUp,
    signOut,
    resetPasswordForEmail,
    updateUserPassword,

    // Progress methods
    markChapterComplete,
    updateProgress,

    // Bookmark methods
    toggleBookmark,

    // Helper methods
    isChapterCompleted,
    isChapterBookmarked,
    getCompletedChapterIds,
    getBookmarkedChapterIds,
    getChapterProgress,

    // Refresh methods
    refreshUserData: () => user && loadUserProgressAndBookmarks(user.id),
    refreshProfile: () => user && loadUserProfile(user.id),
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
