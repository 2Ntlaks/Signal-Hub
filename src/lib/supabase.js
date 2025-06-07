import { createClient } from "@supabase/supabase-js";

// NEVER hardcode your keys in the source code!
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

// Validate that environment variables are set
if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error(
    "Missing Supabase environment variables. Please check your .env file."
  );
}

// Log only the URL (never log the key!)
console.log("🔗 Connecting to Supabase project:", supabaseUrl);

// Create the client
export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true,
    storageKey: "supabase.auth.token",
    storage: window.localStorage,
  },
});

// Helper functions remain the same as before...
export const supabaseHelpers = {
  // Authentication
  async signUp(email, password, metadata = {}) {
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: metadata,
        },
      });
      return { data, error };
    } catch (err) {
      console.error("SignUp error:", err);
      return { data: null, error: err };
    }
  },

  async signIn(email, password) {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      return { data, error };
    } catch (err) {
      console.error("SignIn error:", err);
      return { data: null, error: err };
    }
  },

  async signOut() {
    try {
      const { error } = await supabase.auth.signOut();
      return { error };
    } catch (err) {
      console.error("SignOut error:", err);
      return { error: err };
    }
  },

  async getCurrentUser() {
    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      return user;
    } catch (err) {
      console.error("Get user error:", err);
      return null;
    }
  },

  // Profiles
  async getProfile(userId) {
    try {
      const { data, error } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", userId)
        .single();
      return { data, error };
    } catch (err) {
      console.error("Get profile error:", err);
      return { data: null, error: err };
    }
  },

  async createProfile(userId, profileData) {
    try {
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
    } catch (err) {
      console.error("Create profile error:", err);
      return { data: null, error: err };
    }
  },

  async updateProfile(userId, updates) {
    try {
      const { data, error } = await supabase
        .from("profiles")
        .update(updates)
        .eq("id", userId)
        .select()
        .single();
      return { data, error };
    } catch (err) {
      console.error("Update profile error:", err);
      return { data: null, error: err };
    }
  },

  // Chapters
  async getChapters() {
    try {
      const { data, error } = await supabase
        .from("chapters")
        .select("*")
        .order("chapter_order");
      return { data, error };
    } catch (err) {
      console.error("Get chapters error:", err);
      return { data: [], error: err };
    }
  },

  async getChapter(id) {
    try {
      const { data, error } = await supabase
        .from("chapters")
        .select("*")
        .eq("id", id)
        .single();
      return { data, error };
    } catch (err) {
      console.error("Get chapter error:", err);
      return { data: null, error: err };
    }
  },

  // --- NEW SEARCH FUNCTION ADDED HERE ---
  async searchChapters(searchTerm) {
    try {
      const { data, error } = await supabase.rpc("search_chapters", {
        search_term: searchTerm,
      });
      return { data, error };
    } catch (err) {
      console.error("Search chapters error:", err);
      return { data: null, error: err };
    }
  },

  async createChapter(chapter) {
    try {
      const { data, error } = await supabase
        .from("chapters")
        .insert([chapter])
        .select()
        .single();
      return { data, error };
    } catch (err) {
      console.error("Create chapter error:", err);
      return { data: null, error: err };
    }
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

      const result = data && data.length > 0 ? data[0] : null;
      return { data: result, error: null };
    } catch (err) {
      console.error("Update chapter error:", err);
      return { data: null, error: err };
    }
  },

  async deleteChapter(id) {
    try {
      const { error } = await supabase.from("chapters").delete().eq("id", id);
      return { error };
    } catch (err) {
      console.error("Delete chapter error:", err);
      return { error: err };
    }
  },

  // User Progress
  async getUserProgress(userId) {
    try {
      const { data, error } = await supabase
        .from("user_progress")
        .select("*, chapters(*)")
        .eq("user_id", userId);
      return { data: data || [], error };
    } catch (err) {
      console.error("Get user progress error:", err);
      return { data: [], error: err };
    }
  },

  async updateProgress(userId, chapterId, progressData) {
    try {
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
    } catch (err) {
      console.error("Update progress error:", err);
      return { data: null, error: err };
    }
  },

  async markChapterComplete(userId, chapterId) {
    try {
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
    } catch (err) {
      console.error("Mark chapter complete error:", err);
      return { data: null, error: err };
    }
  },

  // Bookmarks
  async getUserBookmarks(userId) {
    try {
      const { data, error } = await supabase
        .from("bookmarks")
        .select("*, chapters(*)")
        .eq("user_id", userId);
      return { data: data || [], error };
    } catch (err) {
      console.error("Get bookmarks error:", err);
      return { data: [], error: err };
    }
  },

  async toggleBookmark(userId, chapterId) {
    try {
      const { data: existing } = await supabase
        .from("bookmarks")
        .select("id")
        .eq("user_id", userId)
        .eq("chapter_id", chapterId)
        .single();

      if (existing) {
        const { error } = await supabase
          .from("bookmarks")
          .delete()
          .eq("user_id", userId)
          .eq("chapter_id", chapterId);
        return { removed: true, error };
      } else {
        const { data, error } = await supabase
          .from("bookmarks")
          .insert([{ user_id: userId, chapter_id: chapterId }])
          .select()
          .single();
        return { added: true, data, error };
      }
    } catch (err) {
      console.error("Toggle bookmark error:", err);
      return { error: err };
    }
  },

  // Analytics helpers for admin
  async getUserStats() {
    try {
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
    } catch (err) {
      console.error("Get user stats error:", err);
      return {
        users: [],
        progress: [],
        errors: { general: err },
      };
    }
  },

  // File operations
  async uploadFile(bucket, path, file) {
    try {
      const { data, error } = await supabase.storage
        .from(bucket)
        .upload(path, file, {
          cacheControl: "3600",
          upsert: true,
        });
      return { data, error };
    } catch (err) {
      console.error("Upload file error:", err);
      return { data: null, error: err };
    }
  },

  async deleteFile(bucket, path) {
    try {
      const { data, error } = await supabase.storage
        .from(bucket)
        .remove([path]);
      return { data, error };
    } catch (err) {
      console.error("Delete file error:", err);
      return { data: null, error: err };
    }
  },

  async getFileUrl(bucket, path) {
    try {
      const { data, error } = await supabase.storage
        .from(bucket)
        .createSignedUrl(path, 60);

      if (error) {
        throw error;
      }

      return data.signedUrl;
    } catch (err) {
      console.error("Get file URL error:", err);
      return null;
    }
  },

  async getSignedUrlForDownload(bucket, path) {
    try {
      const { data, error } = await supabase.storage
        .from(bucket)
        .createSignedUrl(path, 60, {
          download: true,
        });

      if (error) {
        throw error;
      }

      return data.signedUrl;
    } catch (err) {
      console.error("Get signed URL for download error:", err);
      return null;
    }
  },

  async listFiles(bucket, folder = "") {
    try {
      const { data, error } = await supabase.storage.from(bucket).list(folder);
      return { data, error };
    } catch (err) {
      console.error("List files error:", err);
      return { data: [], error: err };
    }
  },

  async updateChapterFiles(chapterId, filePaths) {
    try {
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
    } catch (err) {
      console.error("Update chapter files error:", err);
      return { data: null, error: err };
    }
  },
};
