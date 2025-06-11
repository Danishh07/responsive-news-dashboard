/**
 * DashboardStats Component
 * 
 * Displays key statistics and metrics about the news articles in a grid layout.
 * 
 * Features:
 * - Article count statistics (total, news, blogs)
 * - Author count with unique author detection
 * - Responsive grid layout (1-3 columns based on screen size)
 * - Dynamic positive/negative indicators for metrics
 * - Real-time calculation from article data
 * - Accessible design with proper icons and labels
 */

"use client";

import { useMemo } from "react";
import { Article } from "@/types";
import StatCard from "@/components/ui/StatCard";
import { 
  FaNewspaper, 
  FaBook, 
  FaUsers
  // FaCalendarAlt // Not used in current implementation
} from "react-icons/fa";

/**
 * Props interface for DashboardStats component
 */
interface DashboardStatsProps {
  articles: Article[];  // Array of articles to calculate statistics from
}

export default function DashboardStats({ articles }: DashboardStatsProps) {
  /**
   * Calculate statistics from articles data
   * 
   * Uses useMemo for performance optimization to prevent
   * unnecessary recalculations on every render.
   */
  const stats = useMemo(() => {
    try {
      // Ensure articles is valid
      const validArticles = Array.isArray(articles) ? articles : [];
      
      // Total count of articles
      const totalCount = validArticles.length;
      
      // Count by type (safely)
      const newsCount = validArticles.filter(article => 
        article && article.type === "news"
      ).length;
      
      const blogCount = validArticles.filter(article => 
        article && article.type === "blog"
      ).length;
      
      // Count unique authors (safely)
      const uniqueAuthors = new Set();
      validArticles.forEach(article => {
        if (article && article.author) {
          uniqueAuthors.add(article.author);
        }
      });
      const authorCount = uniqueAuthors.size;
      
      // Get most recent article date (safely)
      let latestDate = null;
      if (validArticles.length > 0) {
        try {
          const validDates = validArticles
            .filter(article => article && article.publishedAt)
            .map(article => {
              const timestamp = new Date(article.publishedAt).getTime();
              return !isNaN(timestamp) ? timestamp : 0;
            })
            .filter(timestamp => timestamp > 0);
          
          if (validDates.length > 0) {
            latestDate = new Date(Math.max(...validDates));
          }
        } catch (dateError) {
          console.error("Error calculating latest date:", dateError);
        }
      }
      
      return {
        totalCount,
        newsCount,
        blogCount,
        authorCount,
        latestUpdate: latestDate ? latestDate.toLocaleDateString() : "N/A"
      };
    } catch (error) {
      console.error("Error calculating dashboard stats:", error);
      return {
        totalCount: 0,
        newsCount: 0,
        blogCount: 0,
        authorCount: 0,
        latestUpdate: "N/A"
      };
    }
  }, [articles]);

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
      {/* Total Articles Stat Card */}
      <StatCard
        title="Total Articles"
        value={stats.totalCount}
        icon={<FaNewspaper className="h-6 w-6 text-blue-600 dark:text-blue-400" />}
        positive={stats.totalCount > 0}
      />
      
      {/* News Articles Stat Card */}
      <StatCard
        title="News Articles"
        value={stats.newsCount}
        icon={<FaNewspaper className="h-6 w-6 text-green-600 dark:text-green-400" />}
        positive={stats.newsCount >= 3}
      />
      
      {/* Blog Articles Stat Card */}
      <StatCard
        title="Blog Articles"
        value={stats.blogCount}
        icon={<FaBook className="h-6 w-6 text-orange-600 dark:text-orange-400" />}
        change={2.1}
        positive={stats.blogCount >= 5}
      />
      
      {/* Authors Stat Card */}
      <StatCard
        title="Authors"
        value={stats.authorCount}
        icon={<FaUsers className="h-6 w-6 text-purple-600 dark:text-purple-400" />}
      />
    </div>
  );
}
