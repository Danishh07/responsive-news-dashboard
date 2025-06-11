// Jest configuration for Next.js testing environment
const nextJest = require('next/jest');

// Create Jest config with Next.js defaults
const createJestConfig = nextJest({
  dir: './',
});

/** @type {import('jest').Config} */
const customJestConfig = {
  // Setup file to configure testing environment
  setupFilesAfterEnv: ['<rootDir>/tests/jest.setup.js'],
  
  // Module path mapping for TypeScript imports
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/src/$1',
  },
  
  // Use jsdom environment for React component testing
  testEnvironment: 'jest-environment-jsdom',
  
  // Test file patterns to match
  testMatch: ['<rootDir>/tests/**/*.test.(ts|tsx)'],
};

module.exports = createJestConfig(customJestConfig);
