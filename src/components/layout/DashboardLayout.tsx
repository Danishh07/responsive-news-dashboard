/**
 * DashboardLayout Component
 * 
 * The main layout wrapper for all dashboard pages that provides:
 * - Responsive sidebar navigation with mobile support
 * - Header with search functionality and user controls
 * - Consistent layout structure across all dashboard pages
 * - Mobile-first responsive design with breakpoints
 * - Sidebar toggle functionality for mobile devices
 * - Dark mode compatible styling
 * - Search state management integration
 * 
 * This component serves as the foundation for the dashboard interface,
 * ensuring consistent navigation and user experience across all pages.
 * It automatically handles responsive behavior and mobile optimizations.
 */

"use client";

import { useState } from "react";
import { useDispatch } from "react-redux";
import { setSearchQuery } from "@/redux/filterSlice";
import Header from "./Header";
import Sidebar from "./Sidebar";

/**
 * Props interface for DashboardLayout component
 */
interface DashboardLayoutProps {
  children: React.ReactNode;  // Page content to be rendered in the main area
}

export default function DashboardLayout({ children }: DashboardLayoutProps) {
  // Local state for sidebar visibility (mobile responsive)
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const dispatch = useDispatch();

  /**
   * Toggle sidebar visibility on mobile devices
   * Provides smooth open/close animation for better UX
   */
  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  /**
   * Handle search functionality from header
   * Dispatches search query to Redux store for global state management
   */
  const handleSearch = (query: string) => {
    dispatch(setSearchQuery(query));
  };

  /**
   * Detect screen size for responsive behavior
   * Note: This is a simple implementation. In production, consider using
   * useMediaQuery hook or window resize listeners for dynamic detection.
   */
  const isMobile = typeof window !== "undefined" ? window.innerWidth < 1024 : false;

  return (
    <div className="flex h-screen bg-gray-100 dark:bg-gray-900">
      {/* Responsive Sidebar Navigation */}
      <Sidebar
        isMobile={isMobile}
        isSidebarOpen={isSidebarOpen}
        toggleSidebar={toggleSidebar}
      />

      {/* Main Content Area */}
      <div className="flex flex-col flex-1 overflow-hidden">
        {/* Header with Search and User Controls */}
        <Header toggleSidebar={toggleSidebar} onSearch={handleSearch} />

        {/* Page Content with Scrollable Container */}
        <main className="flex-1 overflow-y-auto p-4 md:p-6">
          {children}
        </main>
      </div>
    </div>
  );
}
