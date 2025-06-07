import React, { useState } from "react";
import {
  Search,
  Filter,
  BookOpen,
  Clock,
  Star,
  Zap,
  Loader,
} from "lucide-react";
import { useSearch } from "../hooks/useSearch";

const SearchComponent = ({ onChapterClick }) => {
  // Accept the new prop here
  const { searchQuery, setSearchQuery, searchResults, loading, error } =
    useSearch();
  const [searchFocus, setSearchFocus] = useState(false);

  const popularSearches = [
    "Fourier Transform",
    "Convolution",
    "LTI Systems",
    "Laplace",
    "Z-Transform",
    "Impulse Response",
    "Frequency Domain",
    "Sampling",
  ];

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="text-center">
        <h2 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-4">
          🔍 Search Resources
        </h2>
        <p className="text-gray-600 text-lg max-w-2xl mx-auto">
          Find specific topics, concepts, or chapters across all CPUT materials
        </p>
      </div>

      {/* Search Section */}
      <div className="relative max-w-4xl mx-auto">
        <div
          className={`relative bg-white rounded-2xl border-2 shadow-lg transition-all duration-300 ${
            searchFocus ? "border-blue-300 shadow-xl" : "border-gray-100"
          }`}
        >
          <div className="relative">
            <div className="absolute left-6 top-1/2 transform -translate-y-1/2">
              <Search
                className={`h-6 w-6 transition-colors duration-300 ${
                  searchFocus ? "text-blue-500" : "text-gray-400"
                }`}
              />
            </div>
            <input
              type="text"
              placeholder="Search for topics, formulas, concepts, or specific content..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onFocus={() => setSearchFocus(true)}
              onBlur={() => setSearchFocus(false)}
              className="w-full pl-16 pr-6 py-6 text-lg bg-transparent border-none focus:outline-none placeholder-gray-400"
            />
            {loading && (
              <div className="absolute right-6 top-1/2 transform -translate-y-1/2">
                <Loader className="h-6 w-6 animate-spin text-blue-500" />
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Search Results */}
      {searchQuery && !loading && (
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-bold text-gray-900">
              Search Results ({searchResults.length})
            </h3>
          </div>
          {error && <p className="text-red-500 text-center">{error}</p>}

          {searchResults.length > 0 ? (
            <div className="space-y-4">
              {searchResults.map((chapter) => (
                // Add the onClick handler to this div
                <div
                  key={chapter.id}
                  onClick={() => onChapterClick(chapter)}
                  className="group bg-white rounded-2xl border border-gray-100 shadow-lg hover:shadow-xl transition-all duration-300 p-6 cursor-pointer hover:-translate-y-1"
                >
                  <h4 className="text-lg font-bold text-gray-900 mb-2 group-hover:text-blue-600 transition-colors duration-300">
                    {chapter.title}
                  </h4>
                  <p className="text-gray-600 mb-4 leading-relaxed line-clamp-2">
                    {chapter.description}
                  </p>
                  <span className="text-blue-600 hover:text-blue-700 font-medium text-sm group-hover:underline">
                    View Chapter →
                  </span>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12 bg-white rounded-2xl border border-gray-100 shadow-lg">
              <div className="w-24 h-24 bg-gradient-to-br from-gray-100 to-gray-200 rounded-full flex items-center justify-center mx-auto mb-4">
                <Search className="h-12 w-12 text-gray-400" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                No results found for "{searchQuery}"
              </h3>
              <p className="text-gray-600">
                Try searching with different keywords or check your spelling.
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default SearchComponent;
