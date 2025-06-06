import { useState } from "react";
import { mockChapters } from "../data/mockData";

// Custom hook for search functionality
export const useSearch = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);

  const performSearch = (query) => {
    if (!query.trim()) {
      setSearchResults([]);
      return;
    }

    // Simple search - will be enhanced with Supabase full-text search
    const results = mockChapters.filter(
      (chapter) =>
        chapter.title.toLowerCase().includes(query.toLowerCase()) ||
        chapter.description.toLowerCase().includes(query.toLowerCase())
    );
    setSearchResults(results);
  };

  return {
    searchQuery,
    setSearchQuery,
    searchResults,
    performSearch,
  };
};
