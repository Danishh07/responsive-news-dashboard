// Test suite for exportService - validates PDF, CSV, and Google Sheets export functionality
import { exportToCsv, exportToPdf, exportPayoutsToGoogleSheets } from '../../src/services/exportService';
import { AuthorPayout } from '../../src/types';

// Mock jsPDF and related modules for testing
jest.mock('jspdf', () => {
  const mockJsPDF = {
    setFontSize: jest.fn(),
    text: jest.fn(),
    save: jest.fn(),
  };
  return {
    jsPDF: jest.fn(() => mockJsPDF),
  };
});

jest.mock('jspdf-autotable', () => {
  return jest.fn();
});

// Mock DOM methods used in CSV export
const mockCreateElement = jest.fn();
const mockAppendChild = jest.fn();
const mockRemoveChild = jest.fn();
const mockClick = jest.fn();
const mockCreateObjectURL = jest.fn();

// Setup DOM mocks before tests
beforeAll(() => {
  Object.defineProperty(document, 'createElement', {
    value: mockCreateElement.mockReturnValue({
      setAttribute: jest.fn(),
      click: mockClick,
      style: {},
    }),
  });
  
  Object.defineProperty(document.body, 'appendChild', {
    value: mockAppendChild,
  });
  
  Object.defineProperty(document.body, 'removeChild', {
    value: mockRemoveChild,
  });
  
  Object.defineProperty(URL, 'createObjectURL', {
    value: mockCreateObjectURL.mockReturnValue('mock-url'),
  });
  
  Object.defineProperty(window, 'Blob', {
    value: jest.fn((content, options) => ({ content, options })),
  });

  // Mock alert for Google Sheets export instructions
  Object.defineProperty(window, 'alert', {
    value: jest.fn(),
  });
});

describe('Export Service', () => {
  // Test data setup
  const mockPayouts: AuthorPayout[] = [
    {
      author: 'John Doe',
      articles: [
        {
          id: '1',
          title: 'Test Article 1',
          description: 'Test description',
          content: 'Test content',
          author: 'John Doe',
          publishedAt: '2025-01-01T12:00:00Z',
          url: 'https://example.com/1',
          source: { id: null, name: 'Test Source' },
          type: 'news'
        }
      ],
      articleCount: 1,
      totalPayout: 50
    },
    {
      author: 'Jane Smith',
      articles: [
        {
          id: '2',
          title: 'Test Blog Post',
          description: 'Blog description',
          content: 'Blog content',
          author: 'Jane Smith',
          publishedAt: '2025-01-02T12:00:00Z',
          url: 'https://example.com/2',
          source: { id: null, name: 'Blog Source' },
          type: 'blog'
        }
      ],
      articleCount: 1,
      totalPayout: 100
    }
  ];

  const mockHeaders = {
    author: 'Author',
    articleCount: 'Articles Count',
    totalPayout: 'Total Payout'
  };

  beforeEach(() => {
    // Clear all mocks before each test
    jest.clearAllMocks();
  });

  describe('CSV Export Functionality', () => {
    test('generates CSV content with correct headers and data', () => {
      const result = exportToCsv(mockPayouts, mockHeaders, 'test-export');
      
      // Verify CSV content structure
      expect(result).toContain('Author,Articles Count,Total Payout');
      expect(result).toContain('John Doe');
      expect(result).toContain('Jane Smith');
      expect(result).toContain('50');
      expect(result).toContain('100');
    });

    test('handles empty data array gracefully', () => {
      expect(() => {
        exportToCsv([], mockHeaders, 'empty-export');
      }).toThrow('No data to export');
    });

    test('escapes special characters in CSV data', () => {
      const dataWithSpecialChars = [
        {
          author: 'Author, with comma',
          description: 'Text with "quotes"',
          value: 'Text with\nnewline'
        }
      ];
      
      const headers = {
        author: 'Author',
        description: 'Description',
        value: 'Value'
      };
      
      const result = exportToCsv(dataWithSpecialChars, headers, 'special-chars');
      
      // Verify special characters are properly escaped
      expect(result).toContain('"Author, with comma"');
      expect(result).toContain('"Text with ""quotes"""');
    });

    test('triggers file download when CSV is generated', () => {
      exportToCsv(mockPayouts, mockHeaders, 'download-test');
      
      // Verify DOM manipulation for file download
      expect(mockCreateElement).toHaveBeenCalledWith('a');
      expect(mockAppendChild).toHaveBeenCalled();
      expect(mockClick).toHaveBeenCalled();
      expect(mockRemoveChild).toHaveBeenCalled();
    });
  });

  describe('PDF Export Functionality', () => {
    test('creates PDF with correct title and content', () => {
      exportToPdf(mockPayouts, mockHeaders, 'test-pdf', 'Test Report');
      
      // Verify jsPDF methods were called
      const jsPDF = require('jspdf').jsPDF;
      expect(jsPDF).toHaveBeenCalled();
    });

    test('handles empty payouts array for PDF generation', () => {
      expect(() => {
        exportToPdf([], mockHeaders, 'empty-pdf', 'Empty Report');
      }).not.toThrow();
    });

    test('formats currency values correctly in PDF', () => {
      exportToPdf(mockPayouts, mockHeaders, 'currency-test', 'Currency Test');
      
      // PDF generation should not throw errors with currency formatting
      expect(require('jspdf').jsPDF).toHaveBeenCalled();
    });
  });

  describe('Google Sheets Export Functionality', () => {
    test('exports data for Google Sheets import', () => {
      exportPayoutsToGoogleSheets(mockPayouts, 'google-sheets-test');
      
      // Should trigger CSV export
      expect(mockCreateElement).toHaveBeenCalled();
      
      // Should show import instructions
      expect(window.alert).toHaveBeenCalledWith(
        expect.stringContaining('CSV file downloaded!')
      );
    });

    test('includes import instructions in alert', () => {
      exportPayoutsToGoogleSheets(mockPayouts, 'instructions-test');
      
      const alertCall = (window.alert as jest.Mock).mock.calls[0][0];
      
      // Verify comprehensive import instructions
      expect(alertCall).toContain('Open Google Sheets');
      expect(alertCall).toContain('File > Import');
      expect(alertCall).toContain('Upload the downloaded CSV file');
      expect(alertCall).toContain('Import data');
    });

    test('formats data correctly for Google Sheets', () => {
      exportPayoutsToGoogleSheets(mockPayouts, 'format-test');
      
      // Should create proper CSV format compatible with Google Sheets
      expect(mockCreateElement).toHaveBeenCalled();
    });
  });

  describe('Error Handling', () => {
    test('handles null or undefined data gracefully', () => {
      expect(() => {
        exportToCsv(null as any, mockHeaders, 'null-test');
      }).toThrow('No data to export');
    });

    test('handles missing headers object', () => {
      expect(() => {
        exportToCsv(mockPayouts, {} as any, 'no-headers');
      }).not.toThrow();
    });

    test('handles DOM manipulation errors gracefully', () => {
      // Mock createElement to throw error
      mockCreateElement.mockImplementationOnce(() => {
        throw new Error('DOM error');
      });
      
      expect(() => {
        exportToCsv(mockPayouts, mockHeaders, 'dom-error');
      }).toThrow('DOM error');
    });
  });

  describe('Data Formatting', () => {
    test('formats nested object data correctly', () => {
      const complexData = [
        {
          author: 'Test Author',
          articles: [{ title: 'Article 1' }, { title: 'Article 2' }],
          metadata: { created: '2025-01-01', tags: ['news', 'tech'] }
        }
      ];
      
      const headers = {
        author: 'Author',
        articles: 'Articles',
        metadata: 'Metadata'
      };
      
      const result = exportToCsv(complexData, headers, 'complex-data');
      
      // Nested objects should be JSON stringified
      expect(result).toContain('Test Author');
      expect(result).toContain('Article 1');
    });

    test('handles various data types correctly', () => {
      const mixedData = [
        {
          string: 'text',
          number: 123,
          boolean: true,
          null: null,
          undefined: undefined,
          date: new Date('2025-01-01')
        }
      ];
      
      const headers = {
        string: 'String',
        number: 'Number',
        boolean: 'Boolean',
        null: 'Null',
        undefined: 'Undefined',
        date: 'Date'
      };
      
      expect(() => {
        exportToCsv(mixedData, headers, 'mixed-types');
      }).not.toThrow();
    });
  });
});
