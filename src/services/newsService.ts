/**
 * News Service Module
 * 
 * A comprehensive service for fetching, processing, and managing news articles
 * from external APIs with robust error handling and offline support.
 * 
 * Features:
 * - Multiple data sources (News API, mock data)
 * - Offline caching with IndexedDB
 * - Server-side API routes to avoid CORS issues
 * - Fallback mechanisms for reliability
 * - Type-safe article processing
 * - Rate limiting and error recovery
 * - Browser compatibility optimizations
 * 
 * Architecture:
 * - Primary: Next.js API routes for server-side requests
 * - Fallback: Direct client-side API calls (limited by CORS)
 * - Emergency: Mock data for development and demos
 * - Cache: IndexedDB for offline functionality
 */

// News service for fetching articles from News API with offline support and fallbacks
import axios from "axios";
import { Article } from "@/types";
import { getArticles, saveArticles, isOnline } from "./indexedDbService";

// News API configuration - using NewsAPI.org for reliable data
const NEWS_API_KEY = process.env.NEXT_PUBLIC_NEWS_API_KEY || "";
const NEWS_API_URL = "https://newsapi.org/v2";

// Development flag - set to true to use mock data instead of API calls
const useMockData = false;

/**
 * Configure axios instance with browser-compatible headers
 * 
 * Note: Browsers block User-Agent headers from JavaScript for security,
 * so we use custom headers that provide app identification without conflicts.
 */
const axiosInstance = axios.create({
  headers: {
    'X-App-Name': 'ResponsiveDashboardApp',
    'X-App-Version': '1.0'
  }
});

/**
 * Fetch articles from our Next.js API route (server-side)
 * 
 * This is the preferred method for fetching articles as it:
 * - Avoids CORS issues by using server-side requests
 * - Allows proper header management and API key security
 * - Provides better error handling and response validation
 * - Enables rate limiting and caching on the server side
 * 
 * @param type - Type of articles to fetch ('news' or 'blogs')
 * @returns Promise<Article[]> - Array of processed and validated articles
 * @throws Error if the API request fails or returns invalid data
 */
export const fetchFromServerRoute = async (type: string): Promise<Article[]> => {
  console.log(`Fetching ${type} from server route`);
  
  try {
    // Call our Next.js API route that handles News API requests server-side
    const response = await axiosInstance.get(`/api/news?type=${type}`);
    
    // Validate response structure to ensure data integrity
    if (!response.data || response.data.status !== 'ok' || !Array.isArray(response.data.articles)) {
      console.error("Unexpected server route response:", response.data);
      throw new Error("Invalid server route response format");
    }
    
    return response.data.articles;
  } catch (error) {
    console.error(`Error fetching from server route (${type}):`, error);
    throw error;
  }
};

/**
 * Direct News API call (client-side) - Legacy fallback method
 * 
 * This method calls the News API directly from the browser.
 * Limitations:
 * - CORS restrictions may block requests
 * - API key exposed in client-side code
 * - Limited header customization
 * - No server-side caching benefits
 * 
 * @param query - Search query for articles
 * @param category - News category filter (optional)
 * @returns Promise<Article[]> - Array of fetched articles
 */
export const fetchFromNewsAPI = async (query: string = "technology", category?: string): Promise<Article[]> => {
  console.log(`Fetching articles: query="${query}", category="${category}"`);
  
  if (!NEWS_API_KEY) {
    throw new Error("News API key not configured");
  }

  try {
    // Determine API endpoint based on parameters
    let endpoint = `${NEWS_API_URL}/everything`;
    let params: Record<string, string | number> = {
      apiKey: NEWS_API_KEY,
      q: query,
      language: 'en',
      sortBy: 'publishedAt',
      pageSize: 50, // Limit for better performance
    };

    // Use top-headlines endpoint for category-based searches
    if (category) {
      endpoint = `${NEWS_API_URL}/top-headlines`;
      params = {
        apiKey: NEWS_API_KEY,
        category: category,
        language: 'en',
        pageSize: 50,
      };
    }

    const response = await axiosInstance.get(endpoint, { params });
    
    // Validate API response
    if (response.data.status !== 'ok') {
      throw new Error(`News API error: ${response.data.message || 'Unknown error'}`);
    }

    return response.data.articles || [];
  } catch (error) {
    console.error('Error fetching from News API:', error);
    throw error;
  }
};

/**
 * Comprehensive article fetching with multiple fallback strategies
 * 1. Try server route first (recommended)
 * 2. Fall back to direct API call if server route fails
 * 3. Use offline cached data if network calls fail
 * 4. Use mock data as final fallback
 * @returns Promise<Article[]> - Array of articles from best available source
 */
export const fetchAllArticles = async (): Promise<Article[]> => {
  console.log("Starting comprehensive article fetch...");

  // Strategy 1: Use mock data if explicitly enabled (for development)
  if (useMockData) {
    console.log("Using mock data (development mode)");
    return getMockArticles();
  }

  // Strategy 2: Try fetching from server route (primary method)
  try {
    console.log("Attempting to fetch from server route...");
    const articles = await fetchFromServerRoute("mixed");
    
    if (articles && articles.length > 0) {
      console.log(`Successfully fetched ${articles.length} articles from server route`);
      
      // Save to IndexedDB for offline access
      if (await isOnline()) {
        await saveArticles(articles);
        console.log("Articles saved to offline storage");
      }
      
      return articles;
    }
  } catch (error) {
    console.warn("Server route failed, trying fallback methods:", error);
  }

  // Strategy 3: Try direct API calls as fallback
  try {
    console.log("Attempting direct API calls...");
    const [techArticles, generalArticles] = await Promise.allSettled([
      fetchFromNewsAPI("technology"),
      fetchFromNewsAPI("business"),
    ]);

    const articles: Article[] = [];
    
    // Combine successful results
    if (techArticles.status === 'fulfilled') {
      articles.push(...techArticles.value);
    }
    if (generalArticles.status === 'fulfilled') {
      articles.push(...generalArticles.value);
    }

    if (articles.length > 0) {
      console.log(`Fetched ${articles.length} articles from direct API calls`);
      
      // Save successful results for offline use
      await saveArticles(articles);
      return articles;
    }
  } catch (error) {
    console.warn("Direct API calls failed:", error);
  }

  // Strategy 4: Try loading from offline storage
  try {
    console.log("Attempting to load from offline storage...");
    const cachedArticles = await getArticles();
    
    if (cachedArticles && cachedArticles.length > 0) {
      console.log(`Loaded ${cachedArticles.length} articles from offline storage`);
      return cachedArticles;
    }
  } catch (error) {
    console.warn("Failed to load from offline storage:", error);
  }

  // Strategy 5: Final fallback to mock data
  console.log("All methods failed, using mock data as final fallback");
  return getMockArticles();
};

/**
 * Generate mock articles for development and fallback scenarios
 * Creates realistic article data with varied content types and authors
 * @returns Article[] - Array of mock articles
 */
const getMockArticles = (): Article[] => {
  const mockAuthors = [
    "Sarah Johnson",
    "Michael Chen", 
    "Emily Rodriguez",
    "David Kim",
    "Jessica Thompson",
    "Alex Williams",
    "Maria Garcia",
    "James Brown"
  ];

  const newsTopics = [
    "Technology Breakthrough",
    "Market Analysis", 
    "Climate Change Update",
    "Healthcare Innovation",
    "Economic Forecast",
    "Scientific Discovery",
    "Space Exploration",
    "Renewable Energy"
  ];

  const blogTopics = [
    "Best Practices Guide",
    "Industry Insights",
    "Professional Tips",
    "Career Advice", 
    "Productivity Hacks",
    "Leadership Strategies",
    "Innovation Trends",
    "Success Stories"
  ];

  // Generate 20 mock articles with realistic variation
  return Array.from({ length: 20 }, (_, index) => {
    const isNews = index % 3 !== 0; // 2/3 news, 1/3 blog posts
    const topics = isNews ? newsTopics : blogTopics;
    const topic = topics[index % topics.length];
    const author = mockAuthors[index % mockAuthors.length];
    
    // Generate dates within the last 30 days
    const daysAgo = Math.floor(Math.random() * 30);
    const publishDate = new Date();
    publishDate.setDate(publishDate.getDate() - daysAgo);

    return {
      id: `mock-${index + 1}`,
      title: `${topic}: ${isNews ? 'Breaking News' : 'Expert Analysis'} ${index + 1}`,
      description: `Comprehensive ${isNews ? 'news coverage' : 'blog analysis'} of ${topic.toLowerCase()} with expert insights and detailed information for our readers.`,
      content: `This is a detailed ${isNews ? 'news article' : 'blog post'} about ${topic.toLowerCase()}. It contains comprehensive information, analysis, and insights that would be valuable to readers interested in this topic. The content is substantive and informative, providing real value to the audience.`,
      url: `https://example.com/articles/mock-${index + 1}`,
      urlToImage: `https://picsum.photos/400/300?random=${index + 1}`, // Random placeholder images
      publishedAt: publishDate.toISOString(),
      author: author,
      source: {
        id: isNews ? "mock-news" : "mock-blog",
        name: isNews ? "Mock News Network" : "Professional Blog Hub"
      },
      type: isNews ? ("news" as const) : ("blog" as const),
    };
  });
};
