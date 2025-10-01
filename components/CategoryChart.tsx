'use client';

import { ExpenseSummary } from '@/types/expense';
import { formatCurrency, getCategoryColor } from '@/lib/utils';

interface CategoryChartProps {
  summary: ExpenseSummary;
}

export default function CategoryChart({ summary }: CategoryChartProps) {
  const { categoryBreakdown, totalSpending } = summary;

  if (categoryBreakdown.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Spending by Category</h3>
        <div className="text-center py-8 text-gray-500">
          No data available
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Spending by Category</h3>

      <div className="space-y-4">
        {categoryBreakdown.map(({ category, amount, percentage }) => (
          <div key={category}>
            <div className="flex items-center justify-between mb-1">
              <span className="text-sm font-medium text-gray-700">{category}</span>
              <span className="text-sm font-semibold text-gray-900">
                {formatCurrency(amount)}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <div className="flex-1 bg-gray-200 rounded-full h-2 overflow-hidden">
                <div
                  className={`h-full ${getCategoryColor(category)} transition-all duration-500`}
                  style={{ width: `${percentage}%` }}
                />
              </div>
              <span className="text-xs text-gray-500 w-12 text-right">
                {percentage.toFixed(1)}%
              </span>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-6 pt-4 border-t border-gray-200">
        <div className="flex items-center justify-between">
          <span className="text-sm font-semibold text-gray-900">Total</span>
          <span className="text-lg font-bold text-primary-600">
            {formatCurrency(totalSpending)}
          </span>
        </div>
      </div>
    </div>
  );
}
