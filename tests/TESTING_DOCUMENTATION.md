# Testing Documentation

## 📋 Overview
This document outlines the testing strategy, setup, and guidelines for the Responsive News Dashboard project. Our testing approach ensures code quality, reliability, and maintainability.

## 🧪 Testing Framework & Tools

### Core Testing Stack
- **Jest** - JavaScript testing framework for unit and integration tests
- **React Testing Library** - Testing utilities for React components
- **@testing-library/jest-dom** - Custom Jest matchers for DOM assertions
- **TypeScript** - Type-safe test development

### Testing Configuration
- **Jest Config**: `jest.config.js` - Main Jest configuration
- **Setup File**: `tests/jest.setup.js` - Global test environment setup
- **TypeScript Config**: `tsconfig.test.json` - TypeScript configuration for tests

## 📁 Test Structure

```
tests/
├── jest.setup.js              # Global test setup and mocks
├── components/                # Component tests
│   ├── Card.test.tsx          # Card UI component tests
│   ├── DashboardStats.test.tsx # Dashboard statistics tests
│   └── NewsFilters.test.tsx   # News filtering component tests
└── services/                  # Service layer tests
    └── exportService.test.ts  # Export functionality tests
```

## 🎯 Testing Categories

### 1. Component Tests
**Location**: `tests/components/`
**Purpose**: Test React component rendering, user interactions, and state management

#### DashboardStats.test.tsx
- ✅ **Statistical Calculations**: Validates article counting and author aggregation
- ✅ **Edge Cases**: Handles empty data and duplicate authors
- ✅ **Component Rendering**: Ensures proper StatCard rendering

#### Card.test.tsx  
- ✅ **Basic Rendering**: Title and content display
- ✅ **Icon Support**: Optional icon rendering in header
- ✅ **Styling**: Custom className application
- ✅ **Accessibility**: Semantic structure and focus management
- ✅ **Content Flexibility**: Complex nested content support

#### NewsFilters.test.tsx
- ✅ **Filter Controls**: Author, date, and type filtering
- ✅ **User Interactions**: Form input changes and submissions
- ✅ **Redux Integration**: State management with Redux store
- ✅ **Responsive Behavior**: Mobile filter toggle functionality

### 2. Service Tests
**Location**: `tests/services/`
**Purpose**: Test business logic, API integration, and utility functions

#### exportService.test.ts
- ✅ **CSV Export**: Data formatting, special character escaping, file download
- ✅ **PDF Generation**: jsPDF integration, content formatting
- ✅ **Google Sheets Export**: CSV compatibility, user instructions
- ✅ **Error Handling**: Null data, DOM errors, edge cases
- ✅ **Data Formatting**: Complex objects, mixed data types

## 🔧 Test Setup & Mocks

### Global Mocks (jest.setup.js)
Our test environment includes comprehensive mocks for:

#### Next.js Mocks
```javascript
// Navigation mocking for router-dependent components
jest.mock('next/navigation', () => ({
  useRouter: () => ({ push: jest.fn(), replace: jest.fn() }),
  usePathname: () => '/'
}));
```

#### Authentication Mocks
```javascript
// NextAuth.js mocking for auth-dependent components
jest.mock('next-auth/react', () => ({
  useSession: () => ({ data: { user: { role: 'user' } }, status: 'authenticated' }),
  signIn: jest.fn(),
  signOut: jest.fn()
}));
```

#### Browser API Mocks
- **localStorage**: In-memory storage simulation
- **IndexedDB**: Database operations mocking
- **matchMedia**: Responsive design testing support

## 🏃‍♂️ Running Tests

### Command Reference
```bash
# Run all tests
npm test

# Run tests in watch mode (development)
npm run test:watch

# Generate coverage report
npm run test:coverage

# Run specific test file
npm test Card.test.tsx

# Run tests matching pattern
npm test -- --testNamePattern="should render"
```

### Test Scripts (package.json)
- `npm test` - Single test run
- `npm run test:watch` - Watch mode for development
- `npm run test:coverage` - Coverage reporting

## 📊 Test Coverage Goals

### Coverage Targets
- **Statements**: 80%+ coverage
- **Branches**: 75%+ coverage  
- **Functions**: 80%+ coverage
- **Lines**: 80%+ coverage

### Priority Areas for Testing
1. **Critical Business Logic**: Payout calculations, data export
2. **User Interface Components**: Form interactions, data display
3. **State Management**: Redux actions and reducers
4. **Error Handling**: Edge cases and failure scenarios

## ✅ Testing Best Practices

### Component Testing
```typescript
// ✅ Good: Test behavior, not implementation
test('should display error message when form is invalid', () => {
  render(<LoginForm />);
  fireEvent.click(screen.getByText('Submit'));
  expect(screen.getByText(/invalid credentials/i)).toBeInTheDocument();
});

// ❌ Avoid: Testing implementation details
test('should call validateForm function', () => {
  // Don't test internal function calls
});
```

### Service Testing
```typescript
// ✅ Good: Test public API and edge cases
test('should handle empty data gracefully', () => {
  expect(() => exportToCsv([], headers, 'test')).toThrow('No data to export');
});

// ✅ Good: Mock external dependencies
jest.mock('jspdf', () => ({ jsPDF: jest.fn() }));
```

### Redux Testing
```typescript
// ✅ Good: Test state changes and actions
test('should update filter state when action is dispatched', () => {
  const store = createTestStore();
  store.dispatch(setAuthorFilter('John Doe'));
  expect(store.getState().filter.author).toBe('John Doe');
});
```

## 🔍 Debugging Tests

### Common Issues & Solutions

#### Import Errors
```bash
# Install missing dependencies
npm install --save-dev @testing-library/react @types/jest
```

#### Mock Issues
```javascript
// Reset mocks between tests
beforeEach(() => {
  jest.clearAllMocks();
});
```

#### Async Testing
```typescript
// Handle async operations properly
test('should load data', async () => {
  render(<AsyncComponent />);
  await waitFor(() => {
    expect(screen.getByText('Data loaded')).toBeInTheDocument();
  });
});
```

## 📈 Continuous Integration

### GitHub Actions (Future)
```yaml
# .github/workflows/test.yml
name: Tests
on: [push, pull_request]
jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - uses: actions/setup-node@v2
      - run: npm ci
      - run: npm test -- --coverage
      - run: npm run lint
```

## 🚀 Future Testing Enhancements

### Planned Improvements
1. **E2E Testing**: Playwright or Cypress integration
2. **Visual Regression**: Screenshot comparison testing
3. **Performance Testing**: Component rendering benchmarks
4. **Accessibility Testing**: Automated a11y checks
5. **API Testing**: Mock server integration tests

### Additional Test Files Needed
- `newsService.test.ts` - News API integration tests
- `authSlice.test.ts` - Authentication state management tests
- `payoutSlice.test.ts` - Payout calculation tests
- `useDarkMode.test.ts` - Theme management hook tests

## 📚 Resources

### Documentation Links
- [Jest Documentation](https://jestjs.io/docs/getting-started)
- [React Testing Library](https://testing-library.com/docs/react-testing-library/intro/)
- [Testing Best Practices](https://kentcdodds.com/blog/common-mistakes-with-react-testing-library)

### Team Guidelines
- Write tests for new features before implementation
- Maintain existing test coverage when refactoring
- Use descriptive test names that explain expected behavior
- Group related tests with `describe` blocks
- Mock external dependencies appropriately

## 🎯 Conclusion

Our testing strategy provides a solid foundation for maintaining code quality and preventing regressions. The combination of unit tests, integration tests, and comprehensive mocking ensures that components work correctly in isolation and together.

**Current Status**: ✅ Basic testing infrastructure established with sample tests
**Next Steps**: Expand test coverage to remaining components and services
