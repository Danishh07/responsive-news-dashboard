/**
 * useDarkMode Custom Hook
 * 
 * A comprehensive theme management hook that provides:
 * - Dark/light mode toggle functionality
 * - System theme preference detection and following
 * - Persistent theme storage in localStorage
 * - Hydration-safe implementation for Next.js SSR
 * - Automatic DOM class management for Tailwind CSS
 * - Real-time system preference change detection
 * 
 * Features:
 * - Three theme modes: 'light', 'dark', 'system'
 * - Prevents hydration mismatches in SSR environments
 * - Automatically applies theme classes to document root
 * - Listens for system theme changes and updates accordingly
 * - Provides mounted flag to prevent flash of unstyled content
 * 
 * Usage:
 * ```tsx
 * const { theme, toggleTheme, effectiveTheme, mounted } = useDarkMode();
 * ```
 */

// Custom hook for managing dark/light mode theme with system preference support
"use client";

import { useState, useEffect } from "react";

/**
 * Theme type definition
 * - 'light': Force light mode
 * - 'dark': Force dark mode  
 * - 'system': Follow system preference
 */
type Theme = "light" | "dark" | "system";

export function useDarkMode() {
  // Initialize with dark theme to prevent hydration mismatch
  // This provides a consistent initial state between server and client
  const [theme, setTheme] = useState<Theme>("dark");
  const [mounted, setMounted] = useState(false);

  // Check if running on client side (browser) to avoid SSR issues
  const isClient = typeof window !== "undefined";

  /**
   * Load saved theme preference on component mount
   * 
   * This effect runs once when the component mounts and:
   * - Sets the mounted flag to true
   * - Loads the saved theme from localStorage
   * - Applies default theme if no saved preference exists
   */
  useEffect(() => {
    setMounted(true);
    
    // Load theme from localStorage if available
    if (isClient) {
      const savedTheme = localStorage.getItem("theme") as Theme | null;
      if (savedTheme && (savedTheme === "light" || savedTheme === "dark" || savedTheme === "system")) {
        setTheme(savedTheme);
      } else {
        // Set default theme and save to localStorage
        setTheme("dark");
        localStorage.setItem("theme", "dark");
      }
    }
  }, [isClient]);

  /**
   * Apply theme changes to DOM and handle system preference
   * 
   * This effect runs whenever the theme changes and:
   * - Updates the document root class for Tailwind CSS
   * - Handles system preference detection when theme is 'system'
   * - Ensures proper theme application across the entire app
   */
  useEffect(() => {
    if (!mounted || !isClient) {
      return;
    }

    const root = window.document.documentElement;
    
    // Remove existing theme classes to prevent conflicts
    root.classList.remove("light", "dark");

    let effectiveTheme: "light" | "dark";

    if (theme === "system") {
      // Use system preference when theme is set to "system"
      const systemTheme = window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
      effectiveTheme = systemTheme;
    } else {
      effectiveTheme = theme;
    }

    // Apply the effective theme to document root
    root.classList.add(effectiveTheme);
    
    // Save theme preference to localStorage
    localStorage.setItem("theme", theme);
  }, [theme, mounted, isClient]);

  // Listen for system theme changes when using "system" theme
  useEffect(() => {
    if (!mounted || !isClient || theme !== "system") {
      return;
    }

    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
    
    const handleChange = (e: MediaQueryListEvent) => {
      const root = window.document.documentElement;
      root.classList.remove("light", "dark");
      root.classList.add(e.matches ? "dark" : "light");
    };

    // Add listener for system theme changes
    mediaQuery.addEventListener("change", handleChange);
    
    // Cleanup listener on unmount
    return () => mediaQuery.removeEventListener("change", handleChange);
  }, [theme, mounted, isClient]);

  // Function to toggle between light and dark themes
  const toggleTheme = () => {
    setTheme(prevTheme => {
      switch (prevTheme) {
        case "light":
          return "dark";
        case "dark":
          return "system";
        case "system":
          return "light";
        default:
          return "dark";
      }
    });
  };

  // Function to set specific theme
  const setSpecificTheme = (newTheme: Theme) => {
    setTheme(newTheme);
  };

  // Get current effective theme (resolves "system" to actual theme)
  const getEffectiveTheme = (): "light" | "dark" => {
    if (!mounted || !isClient) {
      return "dark"; // Default for SSR
    }

    if (theme === "system") {
      return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
    }
    
    return theme;
  };

  return {
    theme,              // Current theme setting ("light" | "dark" | "system")
    effectiveTheme: getEffectiveTheme(), // Actual applied theme ("light" | "dark")
    toggleTheme,        // Function to cycle through themes
    setTheme: setSpecificTheme, // Function to set specific theme
    mounted,            // Whether component has mounted (prevents SSR issues)
  };
}
