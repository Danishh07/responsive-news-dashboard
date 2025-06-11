/**
 * Sidebar Component
 * 
 * A responsive navigation sidebar for the dashboard that provides:
 * - Navigation menu with icons and active state indicators
 * - User profile display with avatar and role information
 * - Dark/light mode toggle functionality
 * - Admin-only navigation items (payouts)
 * - Mobile-responsive design with overlay
 * - Sign out functionality
 * - Accessibility features (ARIA labels, keyboard navigation)
 */

"use client";

// import { useState } from "react"; // Not used in current implementation
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useSession, signOut } from "next-auth/react";
import { FaHome, FaNewspaper, FaDollarSign, FaTimes, FaSun, FaMoon, FaSignOutAlt, FaUser } from "react-icons/fa";
// import { FaBars } from "react-icons/fa"; // Not used in current implementation
import { useDarkMode } from "@/hooks/useDarkMode";
import Image from "next/image";

/**
 * Props interface for the Sidebar component
 */
interface SidebarProps {
  isMobile: boolean;           // Whether the current viewport is mobile
  isSidebarOpen: boolean;      // Whether the sidebar is currently open (mobile)
  toggleSidebar: () => void;   // Function to toggle sidebar visibility
}

export default function Sidebar({ isMobile, isSidebarOpen, toggleSidebar }: SidebarProps) {
  const pathname = usePathname();
  const { data: session } = useSession();
  const { toggleTheme, mounted, effectiveTheme } = useDarkMode();
  
  // Prevent hydration mismatch
  if (!mounted) {
    return null;
  }

  // Navigation items
  const navItems = [
    {
      name: "Dashboard",
      href: "/dashboard",
      icon: <FaHome className="mr-3 h-5 w-5" />,
    },
    {
      name: "News & Blogs",
      href: "/dashboard/news",
      icon: <FaNewspaper className="mr-3 h-5 w-5" />,
    },
    {
      name: "Payouts",
      href: "/dashboard/payouts",
      icon: <FaDollarSign className="mr-3 h-5 w-5" />,
      admin: true, // Only for admin users
    },
  ];

  // Filter out admin-only items if user is not admin
  const visibleNavItems = navItems.filter(item => 
    !item.admin || (session?.user?.role === 'admin')
  );

  return (
    <>
      {/* Mobile overlay */}
      {isMobile && isSidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-gray-600 bg-opacity-75 transition-opacity lg:hidden"
          onClick={toggleSidebar}
          aria-hidden="true"
        ></div>
      )}

      {/* Sidebar */}
      <aside
        id="sidebar"
        aria-label="Sidebar navigation"
        className={`${
          isMobile
            ? isSidebarOpen
              ? "fixed inset-y-0 left-0 z-50 w-64 transform transition-transform duration-300 ease-in-out"
              : "fixed inset-y-0 left-0 z-50 w-64 transform -translate-x-full transition-transform duration-300 ease-in-out"
            : "relative w-64 h-screen"
        } flex flex-col bg-gray-800 dark:bg-gray-900 text-white`}
      >
        {/* Sidebar header */}
        <div className="flex items-center justify-between h-16 px-4 bg-gray-900 dark:bg-black">
          <span className="text-xl font-semibold">News Dashboard</span>
          {isMobile && (
            <button
              onClick={toggleSidebar}
              className="p-2 rounded-md text-gray-400 hover:text-white hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-300"
              aria-label="Close sidebar"
            >
              <FaTimes className="h-6 w-6" />
              <span className="sr-only">Close sidebar</span>
            </button>
          )}
        </div>

        {/* User info */}
        <div className="flex flex-col items-center p-4 border-b border-gray-700">          <div className="relative w-12 h-12 rounded-full bg-indigo-600 flex items-center justify-center mb-2" aria-hidden="true">
            {session?.user?.image ? (
              <Image 
                src={session.user.image} 
                alt={session?.user?.name || "User"} 
                fill
                className="rounded-full object-cover"
                sizes="48px"
              />
            ) : (
              <FaUser className="h-6 w-6 text-white" />
            )}
          </div>
          <div className="text-sm font-medium">
            {session?.user?.name || "Guest User"}
          </div>
          <div className="text-xs text-gray-400">
            {session?.user?.role === 'admin' ? "Administrator" : "Regular User"}
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-2 py-4 space-y-1 overflow-y-auto">
          {visibleNavItems.map((item) => (
            <Link
              key={item.name}
              href={item.href}
              className={`${
                pathname === item.href
                  ? "bg-gray-900 text-white"
                  : "text-gray-300 hover:bg-gray-700 hover:text-white"
              } flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors duration-200`}
              aria-current={pathname === item.href ? "page" : undefined}
            >
              {item.icon}
              {item.name}
            </Link>
          ))}
        </nav>

        {/* Sidebar footer */}
        <div className="p-4 border-t border-gray-700">          <div className="flex items-center justify-between mb-4">
            <button
              onClick={toggleTheme}
              className="flex items-center p-2 text-gray-300 hover:text-white rounded-md hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-300"
              aria-label={effectiveTheme === 'dark' ? "Switch to light mode" : "Switch to dark mode"}
            >
              {effectiveTheme === 'dark' ? (
                <>
                  <FaSun className="h-5 w-5 mr-2" />
                  <span>Light Mode</span>
                </>
              ) : (
                <>
                  <FaMoon className="h-5 w-5 mr-2" />
                  <span>Dark Mode</span>
                </>
              )}
            </button>
          </div>

          <button
            onClick={() => signOut({ callbackUrl: "/login" })}
            className="w-full flex items-center px-3 py-2 text-sm font-medium text-gray-300 hover:text-white rounded-md hover:bg-gray-700 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-gray-300"
            aria-label="Sign out of your account"
          >
            <FaSignOutAlt className="mr-3 h-5 w-5" />
            Sign out
          </button>
        </div>
      </aside>
    </>
  );
}