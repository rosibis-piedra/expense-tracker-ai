'use client';

import { Expense } from '@/types/expense';
import { exportToCSV } from '@/lib/utils';

interface ExportButtonProps {
  expenses: Expense[];
}

export default function ExportButton({ expenses }: ExportButtonProps) {
  const handleExport = () => {
    if (expenses.length === 0) {
      alert('No expenses to export');
      return;
    }

    exportToCSV(expenses);
  };

  return (
    <button
      onClick={handleExport}
      disabled={expenses.length === 0}
      className="inline-flex items-center gap-2 px-4 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
    >
      <svg
        className="w-5 h-5"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
        />
      </svg>
      Export CSV
    </button>
  );
}
