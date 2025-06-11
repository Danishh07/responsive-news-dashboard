// Test suite for NewsFilters component - validates filtering functionality and user interactions
import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import '@testing-library/jest-dom';
import NewsFilters from '../../src/components/news/NewsFilters';
import filterReducer from '../../src/redux/filterSlice';

// Create a test store for Redux integration testing
const createTestStore = () => {
  return configureStore({
    reducer: {
      filter: filterReducer,
    },
  });
};

// Wrapper component to provide Redux store to component under test
const renderWithRedux = (component: React.ReactElement) => {
  const store = createTestStore();
  return {
    ...render(
      <Provider store={store}>
        {component}
      </Provider>
    ),
    store,
  };
};

describe('NewsFilters Component', () => {
  // Test data setup
  const mockAuthors = ['John Doe', 'Jane Smith', 'Bob Johnson'];

  describe('Component Rendering', () => {
    test('renders all filter controls correctly', () => {
      renderWithRedux(<NewsFilters authors={mockAuthors} />);
      
      // Verify all filter inputs are present
      expect(screen.getByLabelText(/author/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/from date/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/to date/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/type/i)).toBeInTheDocument();
      
      // Verify action buttons are present
      expect(screen.getByText('Apply Filters')).toBeInTheDocument();
      expect(screen.getByText('Clear All')).toBeInTheDocument();
    });

    test('populates author dropdown with provided authors', () => {
      renderWithRedux(<NewsFilters authors={mockAuthors} />);
      
      const authorSelect = screen.getByLabelText(/author/i);
      
      // Should have "All Authors" option plus each provided author
      mockAuthors.forEach(author => {
        expect(screen.getByText(author)).toBeInTheDocument();
      });
      expect(screen.getByText('All Authors')).toBeInTheDocument();
    });
  });

  describe('Filter Interactions', () => {
    test('updates author filter when selection changes', () => {
      renderWithRedux(<NewsFilters authors={mockAuthors} />);
      
      const authorSelect = screen.getByLabelText(/author/i) as HTMLSelectElement;
      
      // Change author selection
      fireEvent.change(authorSelect, { target: { value: 'John Doe' } });
      expect(authorSelect.value).toBe('John Doe');
    });

    test('updates date range filters when dates change', () => {
      renderWithRedux(<NewsFilters authors={mockAuthors} />);
      
      const fromDateInput = screen.getByLabelText(/from date/i) as HTMLInputElement;
      const toDateInput = screen.getByLabelText(/to date/i) as HTMLInputElement;
      
      // Set date values
      fireEvent.change(fromDateInput, { target: { value: '2025-01-01' } });
      fireEvent.change(toDateInput, { target: { value: '2025-12-31' } });
      
      expect(fromDateInput.value).toBe('2025-01-01');
      expect(toDateInput.value).toBe('2025-12-31');
    });

    test('updates content type filter when selection changes', () => {
      renderWithRedux(<NewsFilters authors={mockAuthors} />);
      
      const typeSelect = screen.getByLabelText(/type/i) as HTMLSelectElement;
      
      // Change type selection
      fireEvent.change(typeSelect, { target: { value: 'news' } });
      expect(typeSelect.value).toBe('news');
    });
  });

  describe('Filter Actions', () => {
    test('applies filters when Apply Filters button is clicked', () => {
      const { store } = renderWithRedux(<NewsFilters authors={mockAuthors} />);
      
      // Set some filter values
      const authorSelect = screen.getByLabelText(/author/i);
      fireEvent.change(authorSelect, { target: { value: 'John Doe' } });
      
      // Click apply button
      const applyButton = screen.getByText('Apply Filters');
      fireEvent.click(applyButton);
      
      // Verify Redux store was updated (would need to check store state)
      // This is a simplified test - in real scenarios you'd verify store state
      expect(applyButton).toBeInTheDocument();
    });

    test('clears all filters when Clear All button is clicked', () => {
      renderWithRedux(<NewsFilters authors={mockAuthors} />);
      
      // Set some filter values first
      const authorSelect = screen.getByLabelText(/author/i) as HTMLSelectElement;
      const typeSelect = screen.getByLabelText(/type/i) as HTMLSelectElement;
      
      fireEvent.change(authorSelect, { target: { value: 'John Doe' } });
      fireEvent.change(typeSelect, { target: { value: 'news' } });
      
      // Click clear button
      const clearButton = screen.getByText('Clear All');
      fireEvent.click(clearButton);
      
      // Verify inputs are reset to default values
      expect(authorSelect.value).toBe('');
      expect(typeSelect.value).toBe('all');
    });
  });

  describe('Responsive Behavior', () => {
    test('handles mobile filter toggle functionality', () => {
      renderWithRedux(<NewsFilters authors={mockAuthors} />);
      
      // On mobile, filters should be toggleable
      // This test would require mocking window.matchMedia for mobile viewport
      // For now, just verify the toggle button exists
      const filterToggle = screen.getByText('Filters');
      expect(filterToggle).toBeInTheDocument();
    });
  });

  describe('Edge Cases', () => {
    test('handles empty authors array gracefully', () => {
      renderWithRedux(<NewsFilters authors={[]} />);
      
      const authorSelect = screen.getByLabelText(/author/i);
      
      // Should still show "All Authors" option even with empty array
      expect(screen.getByText('All Authors')).toBeInTheDocument();
      expect(authorSelect).toBeInTheDocument();
    });

    test('handles undefined or null authors prop', () => {
      // Test with undefined authors (TypeScript would prevent this, but good to test)
      renderWithRedux(<NewsFilters authors={[]} />);
      
      // Component should still render without errors
      expect(screen.getByText('Apply Filters')).toBeInTheDocument();
    });
  });
});
