/**
 * Main Dashboard Page Component
 * 
 * The central hub of the News Dashboard application that provides:
 * - Real-time article statistics and analytics
 * - Data visualization with charts and graphs
 * - Recent articles preview
 * - Error handling and loading states
 * - Automatic payout calculations
 * - Responsive design for all devices
 * 
 * This component serves as the landing page after authentication
 * and gives users an overview of their news content and analytics.
 */

"use client";

import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState, AppDispatch } from "@/redux/store";
import { calculatePayouts, loadRatesFromStorage, loadPayoutsFromStorage } from "@/redux/payoutSlice";

import DashboardStats from "@/components/dashboard/DashboardStats";
import ArticleAnalytics from "@/components/dashboard/ArticleAnalytics";
import Card from "@/components/ui/Card";
// import { FaNewspaper } from "react-icons/fa"; // Not used in current implementation

export default function Dashboard() {
  // Redux dispatch with proper typing for async actions
  const dispatch = useDispatch<AppDispatch>();
  
  // Get news articles and loading state from Redux store
  const { articles, loading, error } = useSelector((state: RootState) => state.news);

  /**
   * Initialize dashboard data on component mount
   * 
   * Loads saved payout rates and previous calculations from localStorage
   * to maintain state between sessions.
   */
  useEffect(() => {
    dispatch(loadRatesFromStorage());
    dispatch(loadPayoutsFromStorage());
  }, [dispatch]);
  
  /**
   * Recalculate payouts whenever articles data changes
   * 
   * This ensures that payout calculations stay in sync with
   * the latest article data from the news API.
   */
  useEffect(() => {
    if (articles.length > 0) {
      dispatch(calculatePayouts(articles));
    }
  }, [articles, dispatch]);
  return (
    <div>
      {/* Dashboard Header */}
      <h1 className="text-2xl font-bold mb-6 text-gray-800 dark:text-white">Dashboard</h1>
      
      {/* Loading State Indicator */}
      {loading && (
        <div className="flex justify-center my-8">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
        </div>
      )}
      
      {/* Error Message Display with Contextual Help */}
      {error && (
        <Card title="Content Loading Error" className="mb-6 border-red-500">
          <div className="text-red-500">
            <p>Failed to fetch articles: {error}</p>
            <p className="mt-2">
              {error.includes("422") 
                ? "We're experiencing issues with our news API. Using backup data instead."
                : error.includes("userAgentMissing") || error.includes("User-Agent") 
                  ? "API request is missing required headers. This will be fixed automatically."
                  : "Please check your internet connection and try again."}
            </p>
            {error.includes("timeout") && (
              <p className="mt-2">The request timed out. The server might be busy. Please try again later.</p>
            )}
            {/* Retry Button for Manual Recovery */}
            <button 
              className="mt-4 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded"
              onClick={() => window.location.reload()}
            >
              Retry
            </button>
          </div>
        </Card>
      )}
      
      {/* Main Dashboard Content - Only show when not loading and no errors */}
      {!loading && !error && (
        <div className="space-y-6">
          {/* Key Metrics and Statistics Section */}
          <DashboardStats articles={articles} />
          
          {/* Data Visualization Charts Section */}
          <ArticleAnalytics articles={articles} />

          {/* Recent Articles Preview Section */}
          <Card title="Recent Articles">
            {articles.length > 0 ? (
              <div className="space-y-3">
                {/* Display latest 5 articles with preview information */}
                {articles.slice(0, 5).map((article) => (
                  <div 
                    key={article.id} 
                    className="border-l-4 border-blue-500 pl-4 py-2 bg-gray-50 dark:bg-gray-700 rounded-r-md"
                  >
                    <h3 className="font-medium text-gray-800 dark:text-white truncate">
                      {article.title}
                    </h3>
                    <p className="text-sm text-gray-600 dark:text-gray-300">
                      By {article.author} • {new Date(article.publishedAt).toLocaleDateString()}
                    </p>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mt-1 line-clamp-2">
                      {article.description}
                    </p>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-500 dark:text-gray-400 text-center py-8">
                No articles available. Visit the News page to load articles.
              </p>
            )}
          </Card>
        </div>
      )}
    </div>
  );
}
