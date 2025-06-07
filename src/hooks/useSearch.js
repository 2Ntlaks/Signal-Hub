import { useState, useCallback } from "react";
import { supabaseHelpers } from "../lib/supabase";
import debounce from "lodash.debounce";

// Custom hook for real-time Supabase search functionality
export const useSearch = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // This function transforms the data from the database to match the format our components expect
  const transformChapterData = (data) => {
    if (!data) return [];
    return data.map((chapter) => ({
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
  };

  const performSearch = async (query) => {
    if (!query.trim()) {
      setSearchResults([]);
      setError(null);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const { data, error } = await supabaseHelpers.searchChapters(
        query.trim()
      );

      if (error) {
        throw error;
      }

      const transformedResults = transformChapterData(data);
      setSearchResults(transformedResults);
    } catch (err) {
      console.error("Search failed:", err);
      setError("Failed to fetch search results. Please try again.");
      setSearchResults([]);
    } finally {
      setLoading(false);
    }
  };

  // Using debounce to prevent API calls on every keystroke
  const debouncedPerformSearch = useCallback(debounce(performSearch, 300), []);

  const handleSearchQueryChange = (query) => {
    setSearchQuery(query);
    debouncedPerformSearch(query);
  };

  return {
    searchQuery,
    setSearchQuery: handleSearchQueryChange,
    searchResults,
    loading,
    error,
  };
};
