/**
 * News Redux Slice
 * 
 * Manages the global state for news articles in the application.
 * 
 * Features:
 * - Article data storage and management
 * - Loading and error state handling
 * - Advanced filtering capabilities
 * - Real-time search functionality
 * - Data validation and error recovery
 * - Type-safe Redux Toolkit implementation
 * 
 * This slice handles all news-related state changes including
 * fetching articles from APIs, filtering based on user criteria,
 * and maintaining UI state for loading and error conditions.
 */

import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Article, FilterState, NewsState } from '@/types';

/**
 * Initial state for the news slice
 * 
 * Defines the default state structure when the application starts
 * or when the state is reset.
 */
const initialState: NewsState = {
  articles: [],           // All fetched articles
  filteredArticles: [],   // Articles after applying filters
  loading: false,         // Loading state for API calls
  error: null,           // Error message if any operation fails
};

/**
 * News slice with reducers for managing article state
 * 
 * Contains all the action creators and reducers needed to manage
 * news articles, filtering, and UI state in the Redux store.
 */
export const newsSlice = createSlice({
  name: 'news',
  initialState,
  reducers: {
    /**
     * Initiates news fetching process
     * Sets loading to true and clears any previous errors
     */
    fetchNewsStart: (state) => {
      state.loading = true;
      state.error = null;
    },

    /**
     * Handles successful news fetch
     * 
     * Processes and validates the fetched articles, ensuring data integrity
     * and updating both articles and filteredArticles arrays.
     */
    fetchNewsSuccess: (state, action: PayloadAction<Article[]>) => {
      try {
        // Ensure the payload is valid
        const articles = Array.isArray(action.payload) ? action.payload : [];
        
        // Process and clean articles if needed
        const cleanArticles = articles.filter(article => 
          article && typeof article === 'object' && article.id
        );
        
        state.loading = false;
        state.articles = cleanArticles;
        state.filteredArticles = cleanArticles;
        state.error = null;
      } catch (error) {
        // Handle errors safely
        console.error("Error in fetchNewsSuccess reducer:", error);
        state.loading = false;
        state.error = "Failed to process articles data";
      }
    },

    /**
     * Handles news fetch failure
     * Sets error message and stops loading state
     */
    fetchNewsFailure: (state, action: PayloadAction<string>) => {
      state.loading = false;
      state.error = action.payload;
    },

    /**
     * Clears all news data
     * Resets articles and filtered articles to empty arrays
     */
    clearNews: (state) => {
      state.articles = [];
      state.filteredArticles = [];
    },

    /**
     * Applies filters to the articles collection
     * 
     * Supports multiple filter criteria:
     * - Author name filtering
     * - Date range filtering
     * - Article type filtering (news/blog)
     * - Text search across title and description
     * 
     * All filters can be combined for advanced search capabilities.
     */
    filterNews: (state, action: PayloadAction<FilterState>) => {
      try {
        const { author, dateFrom, dateTo, type, searchQuery } = action.payload;
        
        // Make a safe copy of the articles array to prevent issues with proxies
        const articles = state.articles ? [...state.articles] : [];
        let filtered = articles;
        
        // Filter by author (safely)
        if (author && typeof author === 'string') {
          filtered = filtered.filter(article => 
            article && article.author && typeof article.author === 'string' &&
            article.author.toLowerCase().includes(author.toLowerCase())
          );
        }
        
        // Filter by date range (safely)
        if (dateFrom) {
          const fromDate = new Date(dateFrom);
          filtered = filtered.filter(article => 
            article && article.publishedAt && 
            !isNaN(new Date(article.publishedAt).getTime()) &&
            new Date(article.publishedAt) >= fromDate
          );
        }
        if (dateTo) {
        const toDate = new Date(dateTo);
        filtered = filtered.filter(article => 
          article && article.publishedAt && 
          !isNaN(new Date(article.publishedAt).getTime()) &&
          new Date(article.publishedAt) <= toDate
        );
      }
      
      // Filter by type (safely)
      if (type && type !== 'all') {
        filtered = filtered.filter(article => 
          article && article.type && article.type === type
        );
      }
      
      // Filter by search query (safely)
      if (searchQuery && typeof searchQuery === 'string') {
        const query = searchQuery.toLowerCase();
        filtered = filtered.filter(article => 
          (article.title && typeof article.title === 'string' && 
           article.title.toLowerCase().includes(query)) ||
          (article.description && typeof article.description === 'string' && 
           article.description.toLowerCase().includes(query)) ||
          (article.author && typeof article.author === 'string' && 
           article.author.toLowerCase().includes(query))
        );
      }
      
      // Assign filtered results
      state.filteredArticles = filtered;
      } catch (error) {
        // Catch any errors inside the reducer to prevent crashes
        console.error("Error in filterNews reducer:", error);
        // Fallback to showing all articles if filtering fails
        state.filteredArticles = state.articles;
      }
    }
  },
});

export const { 
  fetchNewsStart, 
  fetchNewsSuccess, 
  fetchNewsFailure, 
  clearNews, 
  filterNews 
} = newsSlice.actions;

export default newsSlice.reducer;
