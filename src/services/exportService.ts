// Export service for generating PDF, CSV, and Google Sheets data
import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';
import { AuthorPayout } from '@/types';

/**
 * Utility function to export data to CSV format
 * Creates downloadable CSV files from array data
 * @param data Array of objects to export
 * @param headers Object mapping data keys to header names
 * @param filename Name of the output file
 */
export const exportToCsv = <T extends Record<string, unknown>>(
  data: T[],
  headers: Record<string, string>,
  filename: string
): string => {
  // Validate input data
  if (!data || data.length === 0) {
    throw new Error('No data to export');
  }

  // Create CSV header row from headers object
  const headerRow = Object.values(headers).join(',');

  // Convert data objects to CSV rows
  const rows = data.map(item => {
    return Object.keys(headers)
      .map(key => {
        // Handle nested objects by converting to JSON string
        const value = typeof item[key] === 'object' && item[key] !== null
          ? JSON.stringify(item[key])
          : item[key];
        
        // Escape commas and quotes in CSV data
        return `"${String(value || '').replace(/"/g, '""')}"`;
      })
      .join(',');
  });

  // Combine header and data rows
  const csvContent = [headerRow, ...rows].join('\n');

  // Create and trigger download
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  const url = URL.createObjectURL(blob);
  
  link.setAttribute('href', url);
  link.setAttribute('download', `${filename}.csv`);
  link.style.visibility = 'hidden';
  
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  
  return csvContent;
};

/**
 * Export payout data to PDF format using jsPDF
 * Creates professional-looking PDF reports with tables
 * @param payouts Array of author payout data
 * @param headers Column headers for the table
 * @param filename Output filename
 * @param title Document title
 */
export const exportToPdf = (
  payouts: AuthorPayout[],
  headers: Record<string, string>,
  filename: string,
  title: string
): void => {
  // Create new PDF document
  const doc = new jsPDF();

  // Add document title
  doc.setFontSize(20);
  doc.text(title, 20, 20);

  // Add generation timestamp
  doc.setFontSize(10);
  doc.text(`Generated on: ${new Date().toLocaleDateString()}`, 20, 30);

  // Prepare table data
  const tableData = payouts.map(payout => [
    payout.author,
    payout.articleCount.toString(),
    `$${payout.totalPayout.toFixed(2)}`,
  ]);

  // Generate table using autoTable plugin
  autoTable(doc, {
    head: [Object.values(headers)],
    body: tableData,
    startY: 40,
    styles: {
      fontSize: 10,
      cellPadding: 5,
    },
    headStyles: {
      fillColor: [41, 128, 185], // Blue header
      textColor: 255,
      fontStyle: 'bold',
    },
    alternateRowStyles: {
      fillColor: [245, 245, 245], // Light gray alternate rows
    },
  });

  // Save the PDF
  doc.save(`${filename}.pdf`);
};

/**
 * Export data for Google Sheets integration
 * Creates downloadable CSV with Google Sheets import instructions
 * @param payouts Author payout data
 * @param filename Output filename
 */
export const exportPayoutsToGoogleSheets = (
  payouts: AuthorPayout[],
  filename: string
): void => {
  // Prepare data for Google Sheets format
  const sheetsData = payouts.map(payout => ({
    Author: payout.author,
    'Article Count': payout.articleCount,
    'Total Payout': payout.totalPayout,
    'Articles': payout.articles.map(a => a.title).join('; '),
  }));

  // Define headers for Google Sheets
  const headers = {
    Author: 'Author',
    'Article Count': 'Article Count',
    'Total Payout': 'Total Payout ($)',
    'Articles': 'Article Titles',
  };

  // Export as CSV (compatible with Google Sheets import)
  exportToCsv(sheetsData, headers, filename);

  // Show instructions to user
  alert(
    'CSV file downloaded! To import into Google Sheets:\n' +
    '1. Open Google Sheets\n' +
    '2. File > Import\n' +
    '3. Upload the downloaded CSV file\n' +
    '4. Choose "Replace spreadsheet" or "Insert new sheet(s)"\n' +
    '5. Click "Import data"'
  );
};

/**
 * Utility to format dates consistently for exports
 */
export const formatDate = (date: Date | string): string => {
  const d = typeof date === 'string' ? new Date(date) : date;
  return d.toISOString().split('T')[0]; // YYYY-MM-DD format
};
