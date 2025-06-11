// TypeScript type definitions for the entire application
// This file centralizes all type definitions for better maintainability

// User authentication and profile types
export interface User {
  id: string;
  name: string;
  email: string;
  image?: string;                    // Optional profile image URL
  role: 'user' | 'admin';           // Role-based access control
}

// Authentication state management types
export interface AuthState {
  user: User | null;                // Current authenticated user
  isAuthenticated: boolean;         // Authentication status flag
  loading: boolean;                 // Loading state for auth operations
  error: string | null;             // Error messages from auth operations
}

// News article and blog post data structure
export interface Article {
  id: string;                       // Unique article identifier
  title: string;                    // Article headline
  description: string;              // Brief article summary
  content: string;                  // Full article content
  author: string;                   // Author name
  publishedAt: string;              // Publication date (ISO string)
  url: string;                      // Original article URL
  urlToImage?: string;              // Optional featured image URL
  source: {                         // Article source information
    id: string | null;              // Source identifier
    name: string;                   // Source display name
  };
  type: 'news' | 'blog';           // Content type classification
}

// News state management for Redux store
export interface NewsState {
  articles: Article[];              // Array of fetched articles
  loading: boolean;                 // Loading state for news operations
  error: string | null;             // Error messages from news API
}

// Filtering and search state management
export interface FilterState {
  author: string | null;            // Selected author filter
  dateFrom: string | null;          // Start date for date range filter
  dateTo: string | null;            // End date for date range filter
  type: 'all' | 'news' | 'blog';    // Content type filter
  searchQuery: string;              // Text search query
}

// Payout calculation and management types
export interface PayoutRate {
  newsRate: number;                 // Payment rate per news article ($)
  blogRate: number;                 // Payment rate per blog post ($)
}

// Individual author payout calculation
export interface AuthorPayout {
  author: string;                   // Author name
  articles: Article[];              // Articles by this author
  articleCount: number;             // Total number of articles
  totalPayout: number;              // Calculated total payout amount ($)
}

// Payout state management for Redux store
export interface PayoutState {
  rates: PayoutRate;                // Current payout rates
  authorPayouts: AuthorPayout[];    // Calculated payouts by author
  loading: boolean;                 // Loading state for payout operations
  error: string | null;             // Error messages from payout calculations
}

// Chart data types
export interface ChartData {
  name: string;
  value: number;
}
