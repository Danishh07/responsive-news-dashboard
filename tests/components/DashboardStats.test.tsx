// Test suite for DashboardStats component - validates statistical calculations and display
import React from 'react';
import { render, screen } from '@testing-library/react';
import DashboardStats from '../../src/components/dashboard/DashboardStats';
import { Article } from '../../src/types';
import '@testing-library/jest-dom';

// Mock the StatCard component to test DashboardStats logic in isolation
// This allows us to verify data calculations without testing StatCard's rendering
jest.mock('../../src/components/ui/StatCard', () => {
  return function MockStatCard({ title, value }: { title: string; value: any }) {
    return (
      <div data-testid={`stat-card-${title.replace(/\s+/g, '-').toLowerCase()}`}>
        <div data-testid={`stat-title-${title.replace(/\s+/g, '-').toLowerCase()}`}>{title}</div>
        <div data-testid={`stat-value-${title.replace(/\s+/g, '-').toLowerCase()}`}>{value}</div>
      </div>
    );
  };
});

describe('DashboardStats Component', () => {
  // Test data setup - represents various article types and authors
  const mockArticles: Article[] = [
    {
      id: '1',
      title: 'News Article 1',
      description: 'Test news article description',
      content: 'Test news content',
      author: 'Author A',
      publishedAt: '2025-05-01T12:00:00Z',
      url: 'https://example.com/1',
      source: { id: null, name: 'Test Source' },
      type: 'news'                    // News type article
    },
    {
      id: '2',
      title: 'News Article 2',
      description: 'Another news article',
      content: 'More news content',
      author: 'Author B',
      publishedAt: '2025-05-02T12:00:00Z',
      url: 'https://example.com/2',
      source: { id: null, name: 'Test Source' },
      type: 'news'                    // Another news article
    },
    {
      id: '3',
      title: 'Blog Article 1',
      description: 'Test blog post description',
      content: 'Test blog content',
      author: 'Author A',             // Same author as first news article
      publishedAt: '2025-05-03T12:00:00Z',
      url: 'https://example.com/3',
      source: { id: null, name: 'Blog Source' },
      type: 'blog'                    // Blog type article
    }
  ];

  describe('Statistical Calculations', () => {
    it('should calculate total articles correctly', () => {
      render(<DashboardStats articles={mockArticles} />);
      
      // Verify total count matches array length
      expect(screen.getByTestId('stat-value-total-articles')).toHaveTextContent('3');
    });

    it('should count unique authors correctly', () => {
      render(<DashboardStats articles={mockArticles} />);
      
      // Should count 2 unique authors (Author A and Author B)
      expect(screen.getByTestId('stat-value-total-authors')).toHaveTextContent('2');
    });

    it('should separate news and blog articles correctly', () => {
      render(<DashboardStats articles={mockArticles} />);
      
      // Should count 2 news articles and 1 blog article
      expect(screen.getByTestId('stat-value-news-articles')).toHaveTextContent('2');
      expect(screen.getByTestId('stat-value-blog-posts')).toHaveTextContent('1');
    });
  });

  describe('Edge Cases', () => {
    it('should handle empty articles array', () => {
      render(<DashboardStats articles={[]} />);
      
      // All counts should be zero for empty array
      expect(screen.getByTestId('stat-value-total-articles')).toHaveTextContent('0');
      expect(screen.getByTestId('stat-value-total-authors')).toHaveTextContent('0');
      expect(screen.getByTestId('stat-value-news-articles')).toHaveTextContent('0');
      expect(screen.getByTestId('stat-value-blog-posts')).toHaveTextContent('0');
    });

    it('should handle articles with same author', () => {
      // Create test data where all articles are by the same author
      const sameAuthorArticles: Article[] = [
        { ...mockArticles[0], id: '1', author: 'Single Author' },
        { ...mockArticles[1], id: '2', author: 'Single Author' },
        { ...mockArticles[2], id: '3', author: 'Single Author' }
      ];

      render(<DashboardStats articles={sameAuthorArticles} />);
      
      // Should show 3 articles but only 1 unique author
      expect(screen.getByTestId('stat-value-total-articles')).toHaveTextContent('3');
      expect(screen.getByTestId('stat-value-total-authors')).toHaveTextContent('1');
    });
  });

  describe('Component Rendering', () => {
    it('should render all required stat cards', () => {
      render(<DashboardStats articles={mockArticles} />);
      
      // Verify all expected stat cards are rendered
      expect(screen.getByTestId('stat-card-total-articles')).toBeInTheDocument();
      expect(screen.getByTestId('stat-card-total-authors')).toBeInTheDocument();
      expect(screen.getByTestId('stat-card-news-articles')).toBeInTheDocument();
      expect(screen.getByTestId('stat-card-blog-posts')).toBeInTheDocument();
    });

    it('should display correct titles for each stat card', () => {
      render(<DashboardStats articles={mockArticles} />);
      
      // Verify stat card titles are correct
      expect(screen.getByTestId('stat-title-total-articles')).toHaveTextContent('Total Articles');
      expect(screen.getByTestId('stat-title-total-authors')).toHaveTextContent('Total Authors');
      expect(screen.getByTestId('stat-title-news-articles')).toHaveTextContent('News Articles');
      expect(screen.getByTestId('stat-title-blog-posts')).toHaveTextContent('Blog Posts');
    });
  });
});
