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

export const supabaseHelpers = {
  // =============================================
  // AUTHENTICATION METHODS
  // =============================================

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

  async resetPasswordForEmail(email) {
    try {
      const { data, error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/update-password`,
      });
      return { data, error };
    } catch (err) {
      console.error("Reset password error:", err);
      return { data: null, error: err };
    }
  },

  async updateUserPassword(password) {
    try {
      const { data, error } = await supabase.auth.updateUser({
        password: password,
      });
      return { data, error };
    } catch (err) {
      console.error("Update password error:", err);
      return { data: null, error: err };
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

  // =============================================
  // PROFILE MANAGEMENT
  // =============================================

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

  // =============================================
  // CHAPTER MANAGEMENT
  // =============================================

  async getChapters() {
    try {
      const { data, error } = await supabase
        .from("chapters")
        .select("*")
        .order("chapter_order");
      return { data: data || [], error };
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

  async searchChapters(searchTerm) {
    try {
      const { data, error } = await supabase.rpc("search_chapters", {
        search_term: searchTerm,
      });
      return { data: data || [], error };
    } catch (err) {
      console.error("Search chapters error:", err);
      return { data: [], error: err };
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

  // =============================================
  // USER PROGRESS TRACKING
  // =============================================

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

  // =============================================
  // BOOKMARK MANAGEMENT
  // =============================================

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

  // =============================================
  // ANALYTICS AND ADMIN
  // =============================================

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

  // =============================================
  // PLATFORM SETTINGS
  // =============================================

  async getSettings() {
    try {
      const { data, error } = await supabase
        .from("platform_settings")
        .select("*");
      if (error) throw error;

      const settings = data.reduce((acc, setting) => {
        acc[setting.key] = setting.value;
        return acc;
      }, {});

      return { data: settings, error: null };
    } catch (err) {
      console.error("Get settings error:", err);
      return { data: null, error: err };
    }
  },

  async updateSetting(key, value) {
    try {
      const { data, error } = await supabase
        .from("platform_settings")
        .update({ value: value })
        .eq("key", key)
        .select();

      if (error) throw error;
      return { data, error: null };
    } catch (err) {
      console.error("Update setting error:", err);
      return { data: null, error: err };
    }
  },

  // =============================================
  // FILE STORAGE OPERATIONS
  // =============================================

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
      return { data: data || [], error };
    } catch (err) {
      console.error("List files error:", err);
      return { data: [], error: err };
    }
  },

  async updateChapterFiles(chapterId, filePaths) {
    try {
      const updateData = {
        updated_at: new Date().toISOString(),
      };

      // Only update fields that are provided
      if (filePaths.notes !== undefined) {
        updateData.notes_file_path = filePaths.notes;
      }
      if (filePaths.solutions !== undefined) {
        updateData.solutions_file_path = filePaths.solutions;
      }
      if (filePaths.formulas !== undefined) {
        updateData.formulas_file_path = filePaths.formulas;
      }

      const { data, error } = await supabase
        .from("chapters")
        .update(updateData)
        .eq("id", chapterId)
        .select()
        .single();
      return { data, error };
    } catch (err) {
      console.error("Update chapter files error:", err);
      return { data: null, error: err };
    }
  },

  // =============================================
  // ENHANCED FILE UPLOAD WITH METADATA
  // =============================================

  async uploadChapterFile(chapterId, materialType, file) {
    try {
      console.log(`📁 Starting upload for ${materialType} file...`);

      // Validate inputs
      if (!chapterId || !materialType || !file) {
        throw new Error("Missing required parameters for file upload");
      }

      // Generate unique file path
      const fileExtension = file.name.split(".").pop();
      const timestamp = Date.now();
      const fileName = `${materialType}-${timestamp}.${fileExtension}`;
      const filePath = `chapter-${chapterId}/${materialType}/${fileName}`;

      console.log(`📂 Generated file path: ${filePath}`);

      // Upload to Supabase Storage
      const { data: uploadData, error: uploadError } = await this.uploadFile(
        "chapter-materials",
        filePath,
        file
      );

      if (uploadError) {
        console.error("Storage upload failed:", uploadError);
        throw uploadError;
      }

      console.log("✅ File uploaded to storage successfully");

      // Get the public URL for verification
      const publicUrl = await this.getFileUrl("chapter-materials", filePath);

      return {
        data: {
          path: filePath,
          url: publicUrl,
          fileName: fileName,
          fileSize: file.size,
          uploadData,
        },
        error: null,
      };
    } catch (err) {
      console.error("Chapter file upload error:", err);
      return { data: null, error: err };
    }
  },

  // =============================================
  // UTILITY FUNCTIONS
  // =============================================

  async checkConnection() {
    try {
      const { data, error } = await supabase
        .from("chapters")
        .select("id")
        .limit(1);

      return { connected: !error, error };
    } catch (err) {
      return { connected: false, error: err };
    }
  },

  async testUpload() {
    try {
      // Test with a small text file
      const testFile = new Blob(["test"], { type: "text/plain" });
      const testPath = `test-${Date.now()}.txt`;

      const { data, error } = await this.uploadFile(
        "chapter-materials",
        testPath,
        testFile
      );

      if (!error) {
        // Clean up test file
        await this.deleteFile("chapter-materials", testPath);
      }

      return { success: !error, error };
    } catch (err) {
      return { success: false, error: err };
    }
  },
};

// Export for direct access if needed
export default supabaseHelpers;
