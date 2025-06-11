import React, { useState } from "react";
import { AuthorPayout } from "@/types";
import { FaFileCsv, FaFilePdf, FaTable, FaFileExcel } from "react-icons/fa";
// import { FaFileDownload } from "react-icons/fa"; // Not used in current implementation
import { exportToPdf, exportPayoutsToGoogleSheets } from "@/services/exportService";

interface PayoutTableProps {
  payouts: AuthorPayout[];
}

export default function PayoutTable({ payouts }: PayoutTableProps) {
  const [expandedAuthor, setExpandedAuthor] = useState<string | null>(null);

  const toggleExpand = (author: string) => {
    setExpandedAuthor(expandedAuthor === author ? null : author);
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(amount);
  };  const handleExportPDF = () => {
    // Define headers for PDF export
    // const headers = {
    //   author: "Author",
    //   articleCount: "Articles Count", 
    //   totalPayout: "Total Payout"
    // };
    
    exportToPdf(payouts, {}, "author_payouts", "Author Payouts Report");
  };

  const handleExportCSV = () => {
    // Define headers for CSV
    // const headers = {
    //   author: "Author",
    //   articleCount: "Articles Count",
    //   totalPayout: "Total Payout ($)",
    //   articleDetails: "Article Details"
    // };
    
    // Use our exportService utility
    // const csvContent = exportPayoutsToGoogleSheets(payouts, "author-payouts");
    exportPayoutsToGoogleSheets(payouts, "author-payouts");
  };
  
  const handleExportGoogleSheets = () => {
    try {
      // Use the specialized function for Google Sheets format
      exportPayoutsToGoogleSheets(payouts, "google_sheets_payouts");
      
      // Show success notification
      const instructions = 
        "CSV file has been downloaded. To import into Google Sheets:\n\n" +
        "1. Open Google Sheets and create a new spreadsheet\n" +
        "2. Click File > Import > Upload\n" +
        "3. Select the downloaded CSV file\n" +
        "4. Select 'Replace spreadsheet' or 'Insert new sheet'\n" +
        "5. Set Import location to 'Replace spreadsheet'\n" +
        "6. Set Separator type to 'Comma'\n" +
        "7. Click 'Import data'";
      
      alert(instructions);
    } catch (error) {
      alert(`Error exporting to Google Sheets format: ${error}`);
    }
  };

  if (payouts.length === 0) {
    return (
      <div className="flex justify-center items-center py-12">
        <div className="text-center">
          <h3 className="text-xl font-medium text-gray-700 dark:text-gray-300">
            No payout data available
          </h3>
          <p className="text-gray-500 dark:text-gray-400 mt-2">
            Payout calculations will appear here once articles are loaded.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden">
      <div className="px-4 py-3 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between">
        <h3 className="text-lg font-semibold text-gray-800 dark:text-white flex items-center">
          <FaTable className="mr-2" />
          Author Payouts
        </h3>
        <div className="flex space-x-2">
          <button
            onClick={handleExportPDF}
            className="p-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"
            title="Export as PDF"
            aria-label="Export as PDF"
          >
            <FaFilePdf />
            <span className="sr-only">Export as PDF</span>
          </button>
          <button
            onClick={handleExportCSV}
            className="p-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"
            title="Export as CSV"
            aria-label="Export as CSV"
          >
            <FaFileCsv />
            <span className="sr-only">Export as CSV</span>
          </button>
          <button
            onClick={handleExportGoogleSheets}
            className="p-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"
            title="Export to Google Sheets"
            aria-label="Export to Google Sheets"
          >
            <FaFileExcel />
            <span className="sr-only">Export to Google Sheets</span>
          </button>
        </div>
      </div>
      
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
          <thead className="bg-gray-50 dark:bg-gray-700">
            <tr>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                Author
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                Articles Count
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                Total Payout
              </th>
              <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
            {payouts.map((payout) => (
              <React.Fragment key={payout.author}>
                <tr className="hover:bg-gray-50 dark:hover:bg-gray-700">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">
                    {payout.author}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">
                    {payout.articleCount}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">
                    {formatCurrency(payout.totalPayout)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <button
                      onClick={() => toggleExpand(payout.author)}
                      className="text-indigo-600 dark:text-indigo-400 hover:text-indigo-900 dark:hover:text-indigo-300"
                    >
                      {expandedAuthor === payout.author ? "Hide Details" : "View Details"}
                    </button>
                  </td>
                </tr>
                
                {/* Expanded details */}
                {expandedAuthor === payout.author && (
                  <tr className="bg-gray-50 dark:bg-gray-700">
                    <td colSpan={4} className="px-6 py-3">
                      <div className="border-t border-gray-200 dark:border-gray-600 pt-3">
                        <h4 className="font-medium text-sm text-gray-800 dark:text-white mb-2">Article Details</h4>
                        <div className="overflow-x-auto">
                          <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-600 text-sm">
                            <thead>
                              <tr>
                                <th className="px-4 py-2 text-left font-medium text-gray-500 dark:text-gray-400">Title</th>
                                <th className="px-4 py-2 text-left font-medium text-gray-500 dark:text-gray-400">Type</th>
                                <th className="px-4 py-2 text-left font-medium text-gray-500 dark:text-gray-400">Date</th>
                                <th className="px-4 py-2 text-right font-medium text-gray-500 dark:text-gray-400">Rate</th>
                              </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-200 dark:divide-gray-600">
                              {payout.articles.map((article) => (
                                <tr key={article.id}>
                                  <td className="px-4 py-2 text-gray-800 dark:text-gray-200">{article.title}</td>
                                  <td className="px-4 py-2 text-gray-600 dark:text-gray-300 capitalize">{article.type}</td>
                                  <td className="px-4 py-2 text-gray-600 dark:text-gray-300">
                                    {new Date(article.publishedAt).toLocaleDateString()}
                                  </td>
                                  <td className="px-4 py-2 text-gray-600 dark:text-gray-300 text-right">
                                    {formatCurrency(article.rate)}
                                  </td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      </div>
                    </td>
                  </tr>
                )}
              </React.Fragment>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
