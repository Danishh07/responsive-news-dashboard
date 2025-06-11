// Jest setup file for configuring testing environment and global mocks
// This file runs before all test files and sets up the testing environment

import '@testing-library/jest-dom';

// Mock Next.js navigation hooks to prevent errors in component tests
jest.mock('next/navigation', () => {
  return {
    // Mock useRouter hook with default router object
    useRouter() {
      return {
        route: '/',                    // Current route path
        pathname: '',                  // Current pathname
        query: {},                     // URL query parameters
        asPath: '',                    // Actual path shown in browser
        push: jest.fn(),              // Navigation function
        replace: jest.fn(),           // Replace function
      };
    },
    // Mock usePathname hook returning root path
    usePathname() {
      return '/';
    },
  };
});

// Mock NextAuth.js authentication hooks and functions
jest.mock('next-auth/react', () => {
  const originalModule = jest.requireActual('next-auth/react');
  return {
    __esModule: true,
    ...originalModule,
    // Mock useSession hook with default authenticated user
    useSession: jest.fn(() => ({
      data: {
        user: { 
          name: "Test User", 
          email: "test@example.com", 
          role: "user" 
        },
      },
      status: "authenticated",
    })),
    // Mock authentication functions
    signIn: jest.fn(),
    signOut: jest.fn(),
  };
});

// Mock localStorage for browser storage testing
const localStorageMock = (function() {
  let store = {};
  return {
    // Get item from mock storage
    getItem(key) {
      return store[key] || null;
    },
    // Set item in mock storage
    setItem(key, value) {
      store[key] = value.toString();
    },
    // Remove item from mock storage
    removeItem(key) {
      delete store[key];
    },
    // Clear all items from mock storage
    clear() {
      store = {};
    }
  };
})();

// Attach localStorage mock to window object
Object.defineProperty(window, 'localStorage', {
  value: localStorageMock,
  writable: true
});

// Mock IndexedDB for offline storage testing
const indexedDBMock = {
  open: jest.fn().mockReturnValue({
    onupgradeneeded: jest.fn(),
    onsuccess: jest.fn(),
    onerror: jest.fn(),
  }),
};

// Attach IndexedDB mock to window object
Object.defineProperty(window, 'indexedDB', {
  value: indexedDBMock,
});

// Mock window.matchMedia for responsive design testing
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: jest.fn().mockImplementation(query => ({
    matches: false,                    // Default to light mode
    media: query,
    onchange: null,
    addListener: jest.fn(),           // Deprecated but still used
    removeListener: jest.fn(),        // Deprecated but still used
    addEventListener: jest.fn(),
    removeEventListener: jest.fn(),
    dispatchEvent: jest.fn(),
  })),
});
