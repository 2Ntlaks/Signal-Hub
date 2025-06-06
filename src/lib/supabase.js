import { createClient } from "@supabase/supabase-js";

// Use environment variables in production, fallback to your values for now
const supabaseUrl =
  import.meta.env.VITE_SUPABASE_URL ||
  "https://nrjefyzyiodmkamsvhgb.supabase.co";
const supabaseAnonKey =
  import.meta.env.VITE_SUPABASE_ANON_KEY ||
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5yamVmeXp5aW9kbWthbXN2aGdiIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDg3MjYwNzQsImV4cCI6MjA2NDMwMjA3NH0.nz_ak7yRGl2N380Qqy9_fyGAOmgeYsqmWuRQwxNtIi8";

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Helper functions for common operations
export const supabaseHelpers = {
  // Authentication
  async signUp(email, password, metadata = {}) {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: metadata,
      },
    });
    return { data, error };
  },

  async signIn(email, password) {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    return { data, error };
  },

  async signOut() {
    const { error } = await supabase.auth.signOut();
    return { error };
  },

  async getCurrentUser() {
    const {
      data: { user },
    } = await supabase.auth.getUser();
    return user;
  },

  // Profiles
  async getProfile(userId) {
    const { data, error } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", userId)
      .single();
    return { data, error };
  },

  async createProfile(userId, profileData) {
    const { data, error } = await supabase
      .from("profiles")
      .insert([
        {
          id: userId,
          ...profileData,
        },
      ])
      .select()
      .single();
    return { data, error };
  },

  async updateProfile(userId, updates) {
    const { data, error } = await supabase
      .from("profiles")
      .update(updates)
      .eq("id", userId)
      .select()
      .single();
    return { data, error };
  },

  // Chapters
  async getChapters() {
    const { data, error } = await supabase
      .from("chapters")
      .select("*")
      .order("chapter_order");
    return { data, error };
  },

  async getChapter(id) {
    const { data, error } = await supabase
      .from("chapters")
      .select("*")
      .eq("id", id)
      .single();
    return { data, error };
  },

  async createChapter(chapter) {
    const { data, error } = await supabase
      .from("chapters")
      .insert([chapter])
      .select()
      .single();
    return { data, error };
  },

  async updateChapter(id, updates) {
    try {
      const { data, error } = await supabase
        .from("chapters")
        .update(updates)
        .eq("id", id)
        .select();

      if (error) {
        console.error("Supabase update error:", error);
        return { data: null, error };
      }

      // Return the first item if array, or null if empty
      const result = data && data.length > 0 ? data[0] : null;
      return { data: result, error: null };
    } catch (err) {
      console.error("Update chapter error:", err);
      return { data: null, error: err };
    }
  },

  async deleteChapter(id) {
    const { error } = await supabase.from("chapters").delete().eq("id", id);
    return { error };
  },

  // User Progress
  async getUserProgress(userId) {
    const { data, error } = await supabase
      .from("user_progress")
      .select("*, chapters(*)")
      .eq("user_id", userId);
    return { data, error };
  },

  async updateProgress(userId, chapterId, progressData) {
    const { data, error } = await supabase
      .from("user_progress")
      .upsert([
        {
          user_id: userId,
          chapter_id: chapterId,
          ...progressData,
        },
      ])
      .select()
      .single();
    return { data, error };
  },

  async markChapterComplete(userId, chapterId) {
    const { data, error } = await supabase
      .from("user_progress")
      .upsert([
        {
          user_id: userId,
          chapter_id: chapterId,
          progress_percentage: 100,
          completed_at: new Date().toISOString(),
        },
      ])
      .select()
      .single();
    return { data, error };
  },

  // Bookmarks
  async getUserBookmarks(userId) {
    const { data, error } = await supabase
      .from("bookmarks")
      .select("*, chapters(*)")
      .eq("user_id", userId);
    return { data, error };
  },

  async toggleBookmark(userId, chapterId) {
    // Check if bookmark exists
    const { data: existing } = await supabase
      .from("bookmarks")
      .select("id")
      .eq("user_id", userId)
      .eq("chapter_id", chapterId)
      .single();

    if (existing) {
      // Remove bookmark
      const { error } = await supabase
        .from("bookmarks")
        .delete()
        .eq("user_id", userId)
        .eq("chapter_id", chapterId);
      return { removed: true, error };
    } else {
      // Add bookmark
      const { data, error } = await supabase
        .from("bookmarks")
        .insert([{ user_id: userId, chapter_id: chapterId }])
        .select()
        .single();
      return { added: true, data, error };
    }
  },

  // Analytics helpers for admin
  async getUserStats() {
    const { data: users, error: usersError } = await supabase
      .from("profiles")
      .select("*");

    const { data: progress, error: progressError } = await supabase
      .from("user_progress")
      .select("*");

    return {
      users: users || [],
      progress: progress || [],
      errors: { usersError, progressError },
    };
  },
  // Add these file management functions to your supabaseHelpers object

  // File operations
  async uploadFile(bucket, path, file) {
    const { data, error } = await supabase.storage
      .from(bucket)
      .upload(path, file, {
        cacheControl: "3600",
        upsert: true,
      });
    return { data, error };
  },

  async deleteFile(bucket, path) {
    const { data, error } = await supabase.storage.from(bucket).remove([path]);
    return { data, error };
  },

  async getFileUrl(bucket, path) {
    const { data } = supabase.storage.from(bucket).getPublicUrl(path);
    return data.publicUrl;
  },

  async listFiles(bucket, folder = "") {
    const { data, error } = await supabase.storage.from(bucket).list(folder);
    return { data, error };
  },

  // Update chapter with file paths
  async updateChapterFiles(chapterId, filePaths) {
    const { data, error } = await supabase
      .from("chapters")
      .update({
        notes_file_path: filePaths.notes || null,
        solutions_file_path: filePaths.solutions || null,
        formulas_file_path: filePaths.formulas || null,
        updated_at: new Date().toISOString(),
      })
      .eq("id", chapterId)
      .select()
      .single();
    return { data, error };
  },
};
