'use client';

import { useState, useEffect } from 'react';
import { Expense, Category } from '@/types/expense';
import {
  ExportFormat,
  ExportOptions,
  exportToCSV,
  exportToJSON,
  exportToPDF,
  filterExpensesForExport,
} from '@/lib/advancedExport';
import { formatCurrency, formatDate } from '@/lib/utils';

interface AdvancedExportModalProps {
  expenses: Expense[];
  isOpen: boolean;
  onClose: () => void;
}

const CATEGORIES: Category[] = [
  'Food',
  'Transportation',
  'Entertainment',
  'Shopping',
  'Bills',
  'Other',
];

export default function AdvancedExportModal({
  expenses,
  isOpen,
  onClose,
}: AdvancedExportModalProps) {
  const [format, setFormat] = useState<ExportFormat>('csv');
  const [filename, setFilename] = useState('expense-report');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [includeAllCategories, setIncludeAllCategories] = useState(true);
  const [selectedCategories, setSelectedCategories] = useState<Category[]>([]);
  const [isExporting, setIsExporting] = useState(false);
  const [showPreview, setShowPreview] = useState(false);

  // Filter expenses based on current options
  const filteredExpenses = filterExpensesForExport(expenses, {
    startDate,
    endDate,
    categories: selectedCategories,
    includeAllCategories,
  });

  const totalAmount = filteredExpenses.reduce((sum, exp) => sum + exp.amount, 0);

  // Reset form when modal opens
  useEffect(() => {
    if (isOpen) {
      setFormat('csv');
      setFilename('expense-report');
      setStartDate('');
      setEndDate('');
      setIncludeAllCategories(true);
      setSelectedCategories([]);
      setShowPreview(false);
    }
  }, [isOpen]);

  const handleCategoryToggle = (category: Category) => {
    setSelectedCategories(prev =>
      prev.includes(category)
        ? prev.filter(c => c !== category)
        : [...prev, category]
    );
  };

  const handleExport = async () => {
    if (filteredExpenses.length === 0) {
      alert('No expenses to export with the current filters');
      return;
    }

    setIsExporting(true);

    // Simulate processing time for better UX
    await new Promise(resolve => setTimeout(resolve, 800));

    try {
      switch (format) {
        case 'csv':
          exportToCSV(filteredExpenses, filename);
          break;
        case 'json':
          exportToJSON(filteredExpenses, filename);
          break;
        case 'pdf':
          exportToPDF(filteredExpenses, filename);
          break;
      }

      // Close modal after successful export
      setTimeout(() => {
        setIsExporting(false);
        onClose();
      }, 500);
    } catch (error) {
      console.error('Export failed:', error);
      alert('Export failed. Please try again.');
      setIsExporting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="bg-gradient-to-r from-primary-600 to-primary-700 text-white px-6 py-4 flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold">Advanced Export</h2>
            <p className="text-primary-100 text-sm mt-1">
              Export your expense data with custom options
            </p>
          </div>
          <button
            onClick={onClose}
            className="text-white hover:text-primary-100 transition-colors"
            disabled={isExporting}
          >
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Left Column - Export Options */}
            <div className="space-y-6">
              {/* Format Selection */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-3">
                  Export Format
                </label>
                <div className="grid grid-cols-3 gap-3">
                  {(['csv', 'json', 'pdf'] as ExportFormat[]).map(fmt => (
                    <button
                      key={fmt}
                      onClick={() => setFormat(fmt)}
                      className={`px-4 py-3 rounded-lg border-2 font-medium transition-all ${
                        format === fmt
                          ? 'border-primary-600 bg-primary-50 text-primary-700'
                          : 'border-gray-300 hover:border-gray-400 text-gray-700'
                      }`}
                    >
                      {fmt.toUpperCase()}
                    </button>
                  ))}
                </div>
              </div>

              {/* Filename Input */}
              <div>
                <label htmlFor="filename" className="block text-sm font-semibold text-gray-700 mb-2">
                  File Name
                </label>
                <input
                  type="text"
                  id="filename"
                  value={filename}
                  onChange={e => setFilename(e.target.value)}
                  placeholder="expense-report"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                />
                <p className="mt-1 text-xs text-gray-500">
                  Extension will be added automatically (.{format})
                </p>
              </div>

              {/* Date Range */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Date Range (Optional)
                </label>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label htmlFor="startDate" className="block text-xs text-gray-600 mb-1">
                      Start Date
                    </label>
                    <input
                      type="date"
                      id="startDate"
                      value={startDate}
                      onChange={e => setStartDate(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 text-sm"
                    />
                  </div>
                  <div>
                    <label htmlFor="endDate" className="block text-xs text-gray-600 mb-1">
                      End Date
                    </label>
                    <input
                      type="date"
                      id="endDate"
                      value={endDate}
                      onChange={e => setEndDate(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 text-sm"
                    />
                  </div>
                </div>
              </div>

              {/* Category Selection */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Categories
                </label>
                <div className="mb-3">
                  <label className="flex items-center space-x-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={includeAllCategories}
                      onChange={e => setIncludeAllCategories(e.target.checked)}
                      className="w-4 h-4 text-primary-600 border-gray-300 rounded focus:ring-primary-500"
                    />
                    <span className="text-sm text-gray-700">Include All Categories</span>
                  </label>
                </div>
                {!includeAllCategories && (
                  <div className="grid grid-cols-2 gap-2">
                    {CATEGORIES.map(category => (
                      <label
                        key={category}
                        className="flex items-center space-x-2 cursor-pointer"
                      >
                        <input
                          type="checkbox"
                          checked={selectedCategories.includes(category)}
                          onChange={() => handleCategoryToggle(category)}
                          className="w-4 h-4 text-primary-600 border-gray-300 rounded focus:ring-primary-500"
                        />
                        <span className="text-sm text-gray-700">{category}</span>
                      </label>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Right Column - Preview & Summary */}
            <div className="space-y-6">
              {/* Export Summary */}
              <div className="bg-gradient-to-br from-primary-50 to-primary-100 rounded-lg p-5 border border-primary-200">
                <h3 className="text-sm font-semibold text-primary-900 mb-3">
                  Export Summary
                </h3>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-primary-700">Records to Export:</span>
                    <span className="font-bold text-primary-900">
                      {filteredExpenses.length}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-primary-700">Total Amount:</span>
                    <span className="font-bold text-primary-900">
                      {formatCurrency(totalAmount)}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-primary-700">Format:</span>
                    <span className="font-bold text-primary-900 uppercase">
                      {format}
                    </span>
                  </div>
                </div>
              </div>

              {/* Preview Toggle */}
              <button
                onClick={() => setShowPreview(!showPreview)}
                className="w-full flex items-center justify-between px-4 py-3 bg-white border-2 border-gray-300 rounded-lg hover:border-primary-500 transition-colors"
              >
                <span className="font-medium text-gray-700">
                  {showPreview ? 'Hide' : 'Show'} Data Preview
                </span>
                <svg
                  className={`w-5 h-5 text-gray-600 transition-transform ${
                    showPreview ? 'rotate-180' : ''
                  }`}
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 9l-7 7-7-7"
                  />
                </svg>
              </button>

              {/* Data Preview */}
              {showPreview && (
                <div className="border border-gray-300 rounded-lg overflow-hidden">
                  <div className="bg-gray-100 px-4 py-2 border-b border-gray-300">
                    <h4 className="text-sm font-semibold text-gray-700">
                      Preview (First 5 Records)
                    </h4>
                  </div>
                  <div className="max-h-64 overflow-y-auto">
                    {filteredExpenses.length === 0 ? (
                      <div className="p-4 text-center text-sm text-gray-500">
                        No expenses match your filters
                      </div>
                    ) : (
                      <table className="w-full text-xs">
                        <thead className="bg-gray-50 sticky top-0">
                          <tr>
                            <th className="px-2 py-2 text-left font-medium text-gray-700">
                              Date
                            </th>
                            <th className="px-2 py-2 text-left font-medium text-gray-700">
                              Category
                            </th>
                            <th className="px-2 py-2 text-right font-medium text-gray-700">
                              Amount
                            </th>
                          </tr>
                        </thead>
                        <tbody>
                          {filteredExpenses.slice(0, 5).map(exp => (
                            <tr key={exp.id} className="border-b border-gray-200">
                              <td className="px-2 py-2 text-gray-700">
                                {formatDate(exp.date)}
                              </td>
                              <td className="px-2 py-2 text-gray-700">{exp.category}</td>
                              <td className="px-2 py-2 text-right font-medium text-gray-900">
                                {formatCurrency(exp.amount)}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="bg-gray-50 px-6 py-4 flex items-center justify-between border-t border-gray-200">
          <button
            onClick={onClose}
            disabled={isExporting}
            className="px-5 py-2 border border-gray-300 rounded-lg hover:bg-gray-100 transition-colors font-medium text-gray-700 disabled:opacity-50"
          >
            Cancel
          </button>
          <button
            onClick={handleExport}
            disabled={isExporting || filteredExpenses.length === 0}
            className="px-6 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
          >
            {isExporting ? (
              <>
                <svg
                  className="animate-spin h-5 w-5 text-white"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  />
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  />
                </svg>
                Exporting...
              </>
            ) : (
              <>
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
                  />
                </svg>
                Export Data
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
