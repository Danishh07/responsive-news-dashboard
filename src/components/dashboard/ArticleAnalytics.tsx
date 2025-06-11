/**
 * ArticleAnalytics Component
 * 
 * Provides comprehensive data visualization and analytics for news articles.
 * 
 * Features:
 * - Bar chart showing top 5 authors by article count (news vs blogs)
 * - Pie chart displaying article type distribution
 * - Responsive charts that adapt to different screen sizes
 * - Interactive tooltips and legends
 * - Color-coded data representation
 * - Real-time calculation from article data
 * - Professional styling with Recharts library
 * 
 * Charts automatically update when article data changes and provide
 * insights into content distribution and author productivity.
 */

"use client";

import { useMemo } from "react";
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  ResponsiveContainer,
  PieChart, 
  Pie, 
  Cell
} from "recharts";
import { Article } from "@/types";
import Card from "@/components/ui/Card";
import { FaChartBar, FaChartPie } from "react-icons/fa";

/**
 * Props interface for ArticleAnalytics component
 */
interface ArticleAnalyticsProps {
  articles: Article[];  // Array of articles to analyze
}

/**
 * Color palette for charts
 * Provides consistent, accessible colors for data visualization
 */
const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8'];

export default function ArticleAnalytics({ articles }: ArticleAnalyticsProps) {
  /**
   * Process and calculate analytics data from articles
   * 
   * Memoized to prevent unnecessary recalculations on every render.
   * Processes raw article data into chart-ready format.
   */
  const { authorData, typeData } = useMemo(() => {
    // Group articles by author and count by type
    const authorStats = articles.reduce((acc, article) => {
      const author = article.author || 'Unknown';
      if (!acc[author]) {
        acc[author] = { news: 0, blogs: 0 };
      }
      if (article.type === 'news') {
        acc[author].news++;
      } else if (article.type === 'blog') {
        acc[author].blogs++;
      }
      return acc;
    }, {} as Record<string, { news: number; blogs: number }>);

    // Convert to array format for charts and get top 5 authors
    const authorArray = Object.entries(authorStats)
      .map(([name, stats]) => ({
        name,
        news: stats.news,
        blogs: stats.blogs,
        total: stats.news + stats.blogs
      }))
      .sort((a, b) => b.total - a.total)
      .slice(0, 5); // Top 5 authors only

    // Calculate article type distribution
    const typeStats = articles.reduce((acc, article) => {
      const type = article.type || 'unknown';
      acc[type] = (acc[type] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    const typeArray = Object.entries(typeStats).map(([name, count]) => ({
      name: name.charAt(0).toUpperCase() + name.slice(1), // Capitalize first letter
      count,
    }));

    return {
      authorData: authorArray,
      typeData: typeArray,
    };
  }, [articles]);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
      {/* Article Types Distribution - Pie Chart */}
      <Card title="Article Types" icon={<FaChartPie />}>
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={typeData}
                cx="50%"
                cy="50%"
                labelLine={false}
                outerRadius={80}
                fill="#8884d8"
                dataKey="count"
                nameKey="name"
                label={({ name, percent }) => 
                  `${name}: ${(percent * 100).toFixed(0)}%`}
              >
                {typeData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip 
                formatter={(value) => [`${value} articles`, "Count"]}
              />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </Card>

      {/* Top Authors Productivity - Bar Chart */}
      <Card title="Top 5 Authors" icon={<FaChartBar />}>
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={authorData}
              margin={{
                top: 5,
                right: 30,
                left: 20,
                bottom: 5,
              }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis 
                dataKey="name"
                tick={{ fontSize: 10 }}
                height={60}
                interval={0}
                angle={-45}
                textAnchor="end"
              />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="news" name="News Articles" fill="#0088FE" />
              <Bar dataKey="blogs" name="Blog Articles" fill="#00C49F" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </Card>
    </div>
  );
}
