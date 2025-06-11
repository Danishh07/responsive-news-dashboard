/**
 * Global Providers Wrapper
 * 
 * A centralized provider component that wraps the entire application
 * with essential context providers for state management and functionality.
 * 
 * Features:
 * - Redux state management for global application state
 * - NextAuth session management for authentication
 * - Toast notifications for user feedback and alerts
 * - Proper provider nesting and configuration
 * - Client-side rendering optimization
 * 
 * Provider Hierarchy:
 * 1. SessionProvider: Manages authentication state and session data
 * 2. Redux Provider: Provides access to the global Redux store
 * 3. ToastContainer: Enables toast notifications throughout the app
 * 
 * This component ensures that all necessary context is available
 * to every component in the application tree.
 */

"use client";

import { Provider } from "react-redux";
import { SessionProvider } from "next-auth/react";
import { store } from "@/redux/store";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function Providers({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <SessionProvider>
      <Provider store={store}>
        {children}

        <ToastContainer
          position="bottom-right"
          autoClose={5000}
          hideProgressBar={false}
          newestOnTop={false}
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
          theme="colored"
        />
      </Provider>
    </SessionProvider>
  );
}
