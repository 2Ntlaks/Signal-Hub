import { useState, useEffect } from "react";
import { supabaseHelpers } from "../lib/supabase";

// Real Supabase-powered chapters hook
export const useChapters = () => {
  const [chapters, setChapters] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Load chapters from Supabase
  const loadChapters = async () => {
    try {
      console.log("[useChapters] 1. Setting loading to true."); // DEBUG LOG
      setLoading(true);

      console.log(
        "[useChapters] 2. Starting to fetch chapters from Supabase..."
      ); // DEBUG LOG
      const { data, error } = await supabaseHelpers.getChapters();
      console.log("[useChapters] 3. Finished fetching from Supabase."); // DEBUG LOG

      if (error) {
        setError(error.message);
        console.error("Error loading chapters:", error);
        // ✏️ MODIFIED: Ensure finally block is reached even on error
        setLoading(false);
        return;
      }

      console.log("[useChapters] 4. Transforming chapter data..."); // DEBUG LOG
      const transformedChapters = data.map((chapter) => ({
        id: chapter.id,
        title: chapter.title,
        description: chapter.description,
        order: chapter.chapter_order,
        isUnlocked: chapter.is_unlocked,
        materials: {
          notes: chapter.notes_file_path,
          solutions: chapter.solutions_file_path,
          formulas: chapter.formulas_file_path,
        },
        createdAt: chapter.created_at,
        updatedAt: chapter.updated_at,
      }));

      setChapters(transformedChapters);
      setError(null);
      console.log("[useChapters] 5. Data transformation complete."); // DEBUG LOG
    } catch (err) {
      setError(err.message);
      console.error("Error in loadChapters:", err);
    } finally {
      console.log("[useChapters] 6. FINALLY: Setting loading to false."); // DEBUG LOG
      setLoading(false);
    }
  };

  // Load chapters on mount
  useEffect(() => {
    loadChapters();
  }, []);

  // CRUD operations
  const addChapter = async (chapterData) => {
    try {
      setLoading(true);

      const supabaseData = {
        title: chapterData.title,
        description: chapterData.description,
        chapter_order: chapterData.order,
        is_unlocked: chapterData.isUnlocked || false,
        notes_file_path: chapterData.materials?.notes || null,
        solutions_file_path: chapterData.materials?.solutions || null,
        formulas_file_path: chapterData.materials?.formulas || null,
      };

      const { data, error } = await supabaseHelpers.createChapter(supabaseData);

      if (error) {
        setError(error.message);
        return { success: false, error: error.message };
      }

      await loadChapters();
      return { success: true, data };
    } catch (err) {
      setError(err.message);
      return { success: false, error: err.message };
    }
  };

  const updateChapter = async (id, updates) => {
    try {
      setLoading(true);

      const supabaseUpdates = {};
      if (updates.title) supabaseUpdates.title = updates.title;
      if (updates.description)
        supabaseUpdates.description = updates.description;
      if (updates.order) supabaseUpdates.chapter_order = updates.order;
      if (updates.hasOwnProperty("isUnlocked"))
        supabaseUpdates.is_unlocked = updates.isUnlocked;
      if (updates.materials) {
        if (updates.materials.notes)
          supabaseUpdates.notes_file_path = updates.materials.notes;
        if (updates.materials.solutions)
          supabaseUpdates.solutions_file_path = updates.materials.solutions;
        if (updates.materials.formulas)
          supabaseUpdates.formulas_file_path = updates.materials.formulas;
      }

      const { data, error } = await supabaseHelpers.updateChapter(
        id,
        supabaseUpdates
      );

      if (error) {
        setError(error.message);
        return { success: false, error: error.message };
      }

      await loadChapters();
      return { success: true, data };
    } catch (err) {
      setError(err.message);
      return { success: false, error: err.message };
    }
  };

  const deleteChapter = async (id) => {
    try {
      setLoading(true);
      const { error } = await supabaseHelpers.deleteChapter(id);
      if (error) {
        setError(error.message);
        return { success: false, error: error.message };
      }
      await loadChapters();
      return { success: true };
    } catch (err) {
      setError(err.message);
      return { success: false, error: err.message };
    }
  };

  return {
    chapters,
    loading,
    error,
    setChapters,
    addChapter,
    updateChapter,
    deleteChapter,
    refreshChapters: loadChapters,
  };
};
