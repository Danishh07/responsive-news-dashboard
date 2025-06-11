"use client";

import { useState } from "react";
import { FaBars, FaSearch, FaBell } from "react-icons/fa";

interface HeaderProps {
  toggleSidebar: () => void;
  onSearch: (query: string) => void;
}

export default function Header({ toggleSidebar, onSearch }: HeaderProps) {
  const [searchQuery, setSearchQuery] = useState("");

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch(searchQuery);
  };

  return (
    <header className="sticky top-0 z-10 bg-white dark:bg-gray-800 shadow-sm">
      <div className="h-16 px-4 flex items-center justify-between">
        <div className="flex items-center">
          {/* Mobile menu button */}          <button
            onClick={toggleSidebar}
            className="p-2 rounded-md text-gray-500 hover:text-gray-700 hover:bg-gray-100 dark:text-gray-400 dark:hover:text-white dark:hover:bg-gray-700 lg:hidden focus:outline-none focus:ring-2 focus:ring-indigo-500"
            aria-label="Toggle sidebar"
            aria-expanded="false"
            aria-controls="sidebar"
          >
            <FaBars className="h-6 w-6" />
          </button>
          
          {/* Brand logo for desktop */}
          <div className="hidden lg:block ml-4">
            <h1 className="text-xl font-semibold text-gray-800 dark:text-white">
              News Dashboard
            </h1>
          </div>
        </div>

        {/* Search bar */}
        <div className="flex-1 max-w-md mx-4">
          <form onSubmit={handleSearchSubmit}>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FaSearch className="h-4 w-4 text-gray-400" />
              </div>              <input
                type="text"
                placeholder="Search articles, authors..."
                value={searchQuery}
                onChange={handleSearchChange}
                aria-label="Search articles and authors"
                className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white dark:bg-gray-700 dark:border-gray-600 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 transition duration-150 ease-in-out sm:text-sm"
              />
            </div>
          </form>
        </div>

        {/* Right section */}
        <div className="flex items-center">
          {/* Notifications */}          <button 
            className="p-2 rounded-md text-gray-500 hover:text-gray-700 hover:bg-gray-100 dark:text-gray-400 dark:hover:text-white dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            aria-label="Notifications"
          >
            <FaBell className="h-5 w-5" />
            <span className="sr-only">Notifications</span>
          </button>
        </div>
      </div>
    </header>
  );
}
