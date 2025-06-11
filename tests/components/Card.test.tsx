// Test suite for Card UI component - validates rendering, styling, and accessibility
import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import Card from '../../src/components/ui/Card';

describe('Card Component', () => {
  describe('Basic Rendering', () => {
    test('renders with title and content correctly', () => {
      render(
        <Card title="Test Card">
          <p data-testid="card-content">Card content</p>
        </Card>
      );
      
      // Verify title is displayed in the header
      expect(screen.getByText('Test Card')).toBeInTheDocument();
      
      // Verify content is rendered within the card body
      expect(screen.getByTestId('card-content')).toBeInTheDocument();
      expect(screen.getByText('Card content')).toBeInTheDocument();
    });

    test('renders only content when no title provided', () => {
      render(
        <Card title="">
          <p data-testid="card-content">Just content</p>
        </Card>
      );
      
      // Content should still be rendered even without title
      expect(screen.getByTestId('card-content')).toBeInTheDocument();
    });
  });
  
  describe('Icon Support', () => {
    test('renders with icon when provided in title area', () => {
      const testIcon = <span data-testid="test-icon">🔍</span>;
      
      render(
        <Card title="Card with Icon" icon={testIcon}>
          <p>Content with icon</p>
        </Card>
      );
      
      // Verify icon is rendered alongside title
      expect(screen.getByTestId('test-icon')).toBeInTheDocument();
      expect(screen.getByText('Card with Icon')).toBeInTheDocument();
    });

    test('renders without icon when not provided', () => {
      render(
        <Card title="Card without Icon">
          <p>Content without icon</p>
        </Card>
      );
      
      // Only title should be present, no icon
      expect(screen.getByText('Card without Icon')).toBeInTheDocument();
      expect(screen.queryByTestId('test-icon')).not.toBeInTheDocument();
    });
  });
  
  describe('Styling and Customization', () => {
    test('applies custom className when provided', () => {
      const { container } = render(
        <Card title="Custom Card" className="custom-class">
          <p>Custom card content</p>
        </Card>
      );
      
      // Verify custom class is applied to the card container
      expect(container.firstChild).toHaveClass('custom-class');
    });

    test('applies default styles when no custom className provided', () => {
      const { container } = render(
        <Card title="Default Card">
          <p>Default styled card</p>
        </Card>
      );
      
      // Card should have default styling classes
      const cardElement = container.firstChild as HTMLElement;
      expect(cardElement).toHaveClass('bg-white', 'dark:bg-gray-800');
    });
  });

  describe('Accessibility', () => {
    test('has proper semantic structure for screen readers', () => {
      render(
        <Card title="Accessible Card">
          <p>Accessible content</p>
        </Card>
      );
      
      // Card should have proper heading structure
      const heading = screen.getByRole('heading', { level: 3 });
      expect(heading).toHaveTextContent('Accessible Card');
    });

    test('maintains focus management within card', () => {
      render(
        <Card title="Focus Test Card">
          <button data-testid="focusable-button">Clickable Button</button>
          <input data-testid="focusable-input" placeholder="Text input" />
        </Card>
      );
      
      // Interactive elements should be focusable within card
      const button = screen.getByTestId('focusable-button');
      const input = screen.getByTestId('focusable-input');
      
      expect(button).toBeInTheDocument();
      expect(input).toBeInTheDocument();
    });
  });

  describe('Content Flexibility', () => {
    test('handles complex nested content structures', () => {
      render(
        <Card title="Complex Card">
          <div data-testid="nested-container">
            <h4>Nested Heading</h4>
            <ul>
              <li data-testid="list-item-1">Item 1</li>
              <li data-testid="list-item-2">Item 2</li>
            </ul>
            <button>Nested Button</button>
          </div>
        </Card>
      );
      
      // All nested content should be rendered correctly
      expect(screen.getByTestId('nested-container')).toBeInTheDocument();
      expect(screen.getByText('Nested Heading')).toBeInTheDocument();
      expect(screen.getByTestId('list-item-1')).toBeInTheDocument();
      expect(screen.getByTestId('list-item-2')).toBeInTheDocument();
      expect(screen.getByText('Nested Button')).toBeInTheDocument();
    });
  });
});
