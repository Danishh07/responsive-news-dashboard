// News filtering component for advanced search and filter functionality
import { useState } from "react";
import { useDispatch } from "react-redux";
import { setAuthorFilter, setDateRangeFilter, setTypeFilter, clearFilters } from "@/redux/filterSlice";
import { FaFilter, FaTimes } from "react-icons/fa";

interface NewsFiltersProps {
  authors: string[]; // List of available authors for filtering
}

export default function NewsFilters({ authors }: NewsFiltersProps) {
  const dispatch = useDispatch();
  
  // State for showing/hiding filter panel
  const [showFilters, setShowFilters] = useState(false);
  
  // Local filter state before applying to Redux store
  const [filters, setFilters] = useState({
    author: "",      // Selected author filter
    dateFrom: "",    // Start date for date range filter
    dateTo: "",      // End date for date range filter
    type: "all",     // Content type filter (all/news/blog)
  });

  // Handle changes to filter inputs
  const handleFilterChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFilters((prev) => ({ ...prev, [name]: value }));
  };
  
  // Apply filters to Redux store
  const handleApplyFilters = () => {
    // Apply author filter (null if empty string)
    dispatch(setAuthorFilter(filters.author || null));
    
    // Apply date range filter with validation
    dispatch(setDateRangeFilter({
      from: filters.dateFrom || null,
      to: filters.dateTo || null,
    }));
      // Apply content type filter
    dispatch(setTypeFilter(filters.type as 'all' | 'news' | 'blog'));
    
    // Hide filter panel on mobile after applying
    setShowFilters(false);
  };

  // Reset all filters to default state
  const handleClearFilters = () => {
    // Reset local state
    setFilters({
      author: "",
      dateFrom: "",
      dateTo: "",
      type: "all",
    });
    
    // Clear Redux filters
    dispatch(clearFilters());
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-4 mb-6">
      {/* Filter toggle button for mobile */}
      <div className="flex items-center justify-between mb-4 lg:hidden">
        <h3 className="text-lg font-semibold text-gray-800 dark:text-white">
          Filters
        </h3>
        <button
          onClick={() => setShowFilters(!showFilters)}
          className="p-2 text-gray-600 dark:text-gray-300 hover:text-gray-800 dark:hover:text-white"
        >
          {showFilters ? <FaTimes /> : <FaFilter />}
        </button>
      </div>

      {/* Filter form - always visible on desktop, toggleable on mobile */}
      <div className={`${showFilters ? 'block' : 'hidden'} lg:block`}>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Author filter dropdown */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Author
            </label>
            <select
              name="author"
              value={filters.author}
              onChange={handleFilterChange}
              className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500"
            >
              <option value="">All Authors</option>
              {authors.map((author) => (
                <option key={author} value={author}>
                  {author}
                </option>
              ))}
            </select>
          </div>

          {/* Date from input */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              From Date
            </label>
            <input
              type="date"
              name="dateFrom"
              value={filters.dateFrom}
              onChange={handleFilterChange}
              className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Date to input */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              To Date
            </label>
            <input
              type="date"
              name="dateTo"
              value={filters.dateTo}
              onChange={handleFilterChange}
              className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Content type filter */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Type
            </label>
            <select
              name="type"
              value={filters.type}
              onChange={handleFilterChange}
              className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">All Types</option>
              <option value="news">News</option>
              <option value="blog">Blog</option>
            </select>
          </div>
        </div>

        {/* Action buttons */}
        <div className="flex flex-wrap gap-3 mt-4">
          <button
            onClick={handleApplyFilters}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors"
          >
            Apply Filters
          </button>
          <button
            onClick={handleClearFilters}
            className="px-4 py-2 bg-gray-300 dark:bg-gray-600 text-gray-700 dark:text-gray-300 rounded-md hover:bg-gray-400 dark:hover:bg-gray-500 focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 transition-colors"
          >
            Clear All
          </button>
        </div>
      </div>
    </div>
  );
}
