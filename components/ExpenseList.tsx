'use client';

import { useState } from 'react';
import { Expense, Category } from '@/types/expense';
import { formatCurrency, formatDate, getCategoryBgColor, getCategoryTextColor } from '@/lib/utils';
import ExpenseForm from './ExpenseForm';

interface ExpenseListProps {
  expenses: Expense[];
  onDelete: (id: string) => void;
  onUpdate: (id: string, data: any) => void;
}

export default function ExpenseList({ expenses, onDelete, onUpdate }: ExpenseListProps) {
  const [editingId, setEditingId] = useState<string | null>(null);

  const handleEdit = (expense: Expense) => {
    setEditingId(expense.id);
  };

  const handleUpdate = (data: any) => {
    if (editingId) {
      onUpdate(editingId, data);
      setEditingId(null);
    }
  };

  const handleCancelEdit = () => {
    setEditingId(null);
  };

  const handleDelete = (id: string) => {
    if (confirm('Are you sure you want to delete this expense?')) {
      onDelete(id);
    }
  };

  if (expenses.length === 0) {
    return (
      <div className="text-center py-12">
        <svg
          className="mx-auto h-12 w-12 text-gray-400"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
          />
        </svg>
        <h3 className="mt-2 text-sm font-medium text-gray-900">No expenses</h3>
        <p className="mt-1 text-sm text-gray-500">Get started by adding your first expense.</p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {expenses.map(expense => (
        <div
          key={expense.id}
          className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow"
        >
          {editingId === expense.id ? (
            <div className="p-4">
              <ExpenseForm
                onSubmit={handleUpdate}
                onCancel={handleCancelEdit}
                initialData={{
                  date: expense.date,
                  amount: expense.amount.toString(),
                  category: expense.category,
                  description: expense.description,
                }}
                submitLabel="Update Expense"
              />
            </div>
          ) : (
            <div className="p-4">
              <div className="flex items-start justify-between">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-2">
                    <span
                      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getCategoryBgColor(
                        expense.category
                      )} ${getCategoryTextColor(expense.category)}`}
                    >
                      {expense.category}
                    </span>
                    <span className="text-sm text-gray-500">{formatDate(expense.date)}</span>
                  </div>
                  <p className="text-gray-900 font-medium mb-1">{expense.description}</p>
                  <p className="text-2xl font-bold text-primary-600">
                    {formatCurrency(expense.amount)}
                  </p>
                </div>
                <div className="flex gap-2 ml-4">
                  <button
                    onClick={() => handleEdit(expense)}
                    className="p-2 text-gray-400 hover:text-primary-600 transition-colors"
                    title="Edit expense"
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
                        d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                      />
                    </svg>
                  </button>
                  <button
                    onClick={() => handleDelete(expense.id)}
                    className="p-2 text-gray-400 hover:text-red-600 transition-colors"
                    title="Delete expense"
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
                        d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                      />
                    </svg>
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
