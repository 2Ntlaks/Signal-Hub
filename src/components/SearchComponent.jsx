import React, { useEffect, useState } from "react";
import { Search, Filter, BookOpen, Clock, Star, Zap } from "lucide-react";
import { useSearch } from "../hooks/useSearch";

const SearchComponent = () => {
  const { searchQuery, setSearchQuery, searchResults, performSearch } =
    useSearch();
  const [searchFocus, setSearchFocus] = useState(false);

  useEffect(() => {
    performSearch(searchQuery);
  }, [searchQuery]);

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

  const quickFilters = [
    { id: "all", label: "All Content", icon: BookOpen, color: "blue" },
    { id: "notes", label: "Study Notes", icon: BookOpen, color: "green" },
    { id: "solutions", label: "Solutions", icon: Star, color: "purple" },
    { id: "formulas", label: "Formulas", icon: Zap, color: "orange" },
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
          {/* Search Input */}
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
          </div>

          {/* Quick Filters */}
          <div className="border-t border-gray-100 p-4">
            <div className="flex flex-wrap gap-2">
              {quickFilters.map((filter) => {
                const Icon = filter.icon;
                return (
                  <button
                    key={filter.id}
                    className={`flex items-center space-x-2 px-4 py-2 rounded-xl text-sm font-medium transition-all duration-300 hover:scale-105 ${
                      filter.color === "blue"
                        ? "bg-blue-50 text-blue-700 hover:bg-blue-100"
                        : filter.color === "green"
                        ? "bg-green-50 text-green-700 hover:bg-green-100"
                        : filter.color === "purple"
                        ? "bg-purple-50 text-purple-700 hover:bg-purple-100"
                        : "bg-orange-50 text-orange-700 hover:bg-orange-100"
                    }`}
                  >
                    <Icon className="h-4 w-4" />
                    <span>{filter.label}</span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Popular Searches */}
        {!searchQuery && (
          <div className="mt-8 bg-white rounded-2xl border border-gray-100 shadow-lg p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center space-x-2">
              <Zap className="h-5 w-5 text-yellow-500" />
              <span>Popular Searches</span>
            </h3>
            <div className="flex flex-wrap gap-2">
              {popularSearches.map((term) => (
                <button
                  key={term}
                  onClick={() => setSearchQuery(term)}
                  className="px-4 py-2 bg-gradient-to-r from-gray-50 to-gray-100 text-gray-700 rounded-xl hover:from-blue-50 hover:to-purple-50 hover:text-blue-700 transition-all duration-300 text-sm font-medium hover:scale-105"
                >
                  {term}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Search Results */}
      {searchQuery && (
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-bold text-gray-900">
              Search Results ({searchResults.length})
            </h3>
            {searchResults.length > 0 && (
              <div className="flex items-center space-x-2 text-sm text-gray-500">
                <Clock className="h-4 w-4" />
                <span>Found in 0.12 seconds</span>
              </div>
            )}
          </div>

          {searchResults.length > 0 ? (
            <div className="space-y-4">
              {searchResults.map((chapter) => (
                <div
                  key={chapter.id}
                  className="group bg-white rounded-2xl border border-gray-100 shadow-lg hover:shadow-xl transition-all duration-300 p-6 cursor-pointer hover:-translate-y-1"
                >
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center space-x-3">
                      <span className="bg-gradient-to-r from-blue-500 to-purple-500 text-white px-3 py-1 rounded-full text-xs font-bold">
                        Chapter {chapter.order}
                      </span>
                      <div className="flex items-center space-x-1">
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            className={`h-3 w-3 ${
                              i < 4
                                ? "text-yellow-400 fill-current"
                                : "text-gray-300"
                            }`}
                          />
                        ))}
                        <span className="text-xs text-gray-500 ml-1">4.8</span>
                      </div>
                    </div>
                    <div className="text-xs text-gray-500">
                      Updated 2 days ago
                    </div>
                  </div>

                  <h4 className="text-lg font-bold text-gray-900 mb-2 group-hover:text-blue-600 transition-colors duration-300">
                    {chapter.title}
                  </h4>

                  <p className="text-gray-600 mb-4 leading-relaxed">
                    {chapter.description}
                  </p>

                  <div className="flex items-center justify-between">
                    <div className="flex space-x-2">
                      {chapter.materials.notes && (
                        <span className="bg-blue-50 text-blue-700 px-2 py-1 rounded-lg text-xs font-medium">
                          📝 Notes
                        </span>
                      )}
                      {chapter.materials.solutions && (
                        <span className="bg-green-50 text-green-700 px-2 py-1 rounded-lg text-xs font-medium">
                          ✅ Solutions
                        </span>
                      )}
                      {chapter.materials.formulas && (
                        <span className="bg-purple-50 text-purple-700 px-2 py-1 rounded-lg text-xs font-medium">
                          🔢 Formulas
                        </span>
                      )}
                    </div>
                    <button className="text-blue-600 hover:text-blue-700 font-medium text-sm group-hover:underline">
                      View Chapter →
                    </button>
                  </div>
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
              <p className="text-gray-600 mb-6">
                Try searching with different keywords or check your spelling
              </p>
              <div className="space-y-2">
                <p className="text-sm text-gray-500">Suggestions:</p>
                <div className="flex flex-wrap justify-center gap-2">
                  {popularSearches.slice(0, 4).map((term) => (
                    <button
                      key={term}
                      onClick={() => setSearchQuery(term)}
                      className="px-3 py-1 bg-blue-50 text-blue-700 rounded-lg text-sm hover:bg-blue-100 transition-colors duration-300"
                    >
                      {term}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default SearchComponent;
