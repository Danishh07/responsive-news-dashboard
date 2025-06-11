/**
 * Redux Store Configuration
 * 
 * Central state management configuration for the News Dashboard application.
 * Uses Redux Toolkit for modern, efficient Redux implementation.
 * 
 * Features:
 * - Centralized state management across all components
 * - Type-safe Redux setup with TypeScript integration
 * - Performance optimizations with Redux Toolkit
 * - Development tools integration for debugging
 * - Middleware configuration for enhanced functionality
 * - Modular slice architecture for maintainability
 * 
 * State Structure:
 * - auth: User authentication and session management
 * - news: Article data, loading states, and API responses
 * - payout: Financial calculations and payout management
 * - filter: Search and filtering criteria for articles
 * 
 * This store serves as the single source of truth for all application state,
 * enabling predictable state updates and efficient data flow.
 */

// Redux store configuration for state management
import { configureStore } from '@reduxjs/toolkit';
import authReducer from './authSlice';
import newsReducer from './newsSlice';
import payoutReducer from './payoutSlice';
import filterReducer from './filterSlice';

/**
 * Configure Redux store with all application slices
 * 
 * The store combines multiple reducers to manage different aspects
 * of the application state in an organized, modular way.
 */
export const store = configureStore({
  reducer: {
    auth: authReducer,      // User authentication and session state
    news: newsReducer,      // News articles, loading states, and API data
    payout: payoutReducer,  // Payout calculations, rates, and financial data
    filter: filterReducer,  // Article filtering, search, and UI preferences
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      // Disable serializable check for complex objects (e.g., Date objects, functions)
      // This allows more flexibility while maintaining Redux best practices
      serializableCheck: false,
    }),
});

/**
 * Export TypeScript types for type-safe Redux usage
 * 
 * These types enable full TypeScript support throughout the application:
 * - RootState: Type for the entire Redux state tree
 * - AppDispatch: Type for dispatch function with async action support
 */
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
