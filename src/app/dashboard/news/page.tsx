"use client";

import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/redux/store";
import { fetchNewsStart, fetchNewsSuccess, fetchNewsFailure, filterNews } from "@/redux/newsSlice";
import { fetchAllArticles } from "@/services/newsService";
import NewsFilters from "@/components/news/NewsFilters";
import NewsGrid from "@/components/news/NewsGrid";
import { FaNewspaper } from "react-icons/fa";

export default function NewsPage() {
  const dispatch = useDispatch();
  const { articles, filteredArticles, loading, error } = useSelector((state: RootState) => state.news);
  const filterState = useSelector((state: RootState) => state.filter);

  // Get unique authors for filter dropdown
  const uniqueAuthors = Array.from(
    new Set(articles.map((article) => article.author))
  ).filter(Boolean) as string[];  // Load articles on component mount
  useEffect(() => {
    let isMounted = true;
    let timeoutId: NodeJS.Timeout | null = null;
    
    // Only fetch if articles haven't been loaded yet
    const loadData = async () => {
      if (articles.length === 0 && !loading && !error) {
        if (isMounted) {
          dispatch(fetchNewsStart());
        }
        
        try {
          // Set a timeout to prevent the request from hanging
          const timeoutPromise = new Promise<never>((_, reject) => {
            timeoutId = setTimeout(() => reject(new Error("Data fetch timed out")), 8000);
          });
          
          // Race between the actual fetch and timeout
          const data = await Promise.race([
            fetchAllArticles(),
            timeoutPromise
          ]);
          
          // Clear the timeout
          if (timeoutId) {
            clearTimeout(timeoutId);
            timeoutId = null;
          }
          
          // Only dispatch if still mounted
          if (isMounted && Array.isArray(data)) {
            dispatch(fetchNewsSuccess(data));
          }
        } catch (error: unknown) {
          // Clear the timeout if it exists
          if (timeoutId) {
            clearTimeout(timeoutId);
            timeoutId = null;
          }
          
          console.error("Error loading articles:", error);
          
          // Only dispatch error if component is still mounted
          if (isMounted) {
            dispatch(fetchNewsFailure(error.message || "Failed to load articles"));
              // Try to load mock data as a fallback
            try {
              const mockService = await import("@/services/newsService");
              // Use the modular approach instead of destructuring
              const mockData = [...mockService.getMockNewsArticles(), ...mockService.getMockBlogArticles()];
              
              if (isMounted) {
                dispatch(fetchNewsSuccess(mockData));
              }
            } catch (mockError) {
              console.error("Failed to load mock data:", mockError);
            }
          }
        }
      }
    };
    
    // Small delay to avoid potential race conditions with other components
    const initTimer = setTimeout(() => {
      if (isMounted) {
        loadData();
      }
    }, 10);
    
    // Cleanup function to prevent state updates after unmount and clear timeouts
    return () => {
      isMounted = false;
      if (timeoutId) clearTimeout(timeoutId);
      clearTimeout(initTimer);
    };
  }, [dispatch, articles.length, loading, error]);

  // Apply filters whenever filter state changes
  useEffect(() => {
    dispatch(filterNews(filterState));
  }, [dispatch, filterState]);

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800 dark:text-white flex items-center">
          <FaNewspaper className="mr-2" />
          News & Blogs
        </h1>
      </div>

      {/* Filters section */}
      <NewsFilters authors={uniqueAuthors} />

      {/* Loading state */}
      {loading && (
        <div className="flex justify-center my-12">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
        </div>
      )}

      {/* Error message */}
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-6">
          <strong className="font-bold">Error!</strong>
          <span className="block sm:inline"> {error}</span>
        </div>
      )}

      {/* Articles grid */}
      {!loading && !error && <NewsGrid articles={filteredArticles} />}

      {/* No results message */}
      {!loading && !error && filteredArticles.length === 0 && articles.length > 0 && (
        <div className="text-center py-12">
          <h3 className="text-xl font-medium text-gray-700 dark:text-gray-300">
            No articles found matching your filters
          </h3>
          <p className="text-gray-500 dark:text-gray-400 mt-2">
            Try adjusting your filter criteria to find more articles
          </p>
        </div>
      )}
    </div>
  );
}
