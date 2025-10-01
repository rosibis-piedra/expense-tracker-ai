'use client';

import { useState } from 'react';
import { useExpenses } from '@/context/ExpenseContext';
import Dashboard from '@/components/Dashboard';
import CategoryChart from '@/components/CategoryChart';
import ExpenseForm from '@/components/ExpenseForm';
import ExpenseList from '@/components/ExpenseList';
import ExpenseFiltersComponent from '@/components/ExpenseFilters';
import CloudExportHub from '@/components/CloudExportHub';

export default function Home() {
  const {
    expenses,
    filteredExpenses,
    filters,
    summary,
    isLoading,
    addExpense,
    updateExpense,
    deleteExpense,
    setFilters,
    resetFilters,
  } = useExpenses();

  const [showAddForm, setShowAddForm] = useState(false);
  const [showCloudExport, setShowCloudExport] = useState(false);

  const handleAddExpense = (data: any) => {
    addExpense(data);
    setShowAddForm(false);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-primary-600 border-t-transparent"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-primary-600 rounded-lg">
                <svg
                  className="w-6 h-6 text-white"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Expense Tracker</h1>
                <p className="text-sm text-gray-600">Manage your personal finances</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <button
                onClick={() => setShowCloudExport(true)}
                className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-lg hover:from-indigo-700 hover:to-purple-700 transition-all shadow-lg shadow-indigo-200 font-medium"
              >
                <span className="text-lg">☁️</span>
                Cloud Export
              </button>
              <button
                onClick={() => setShowAddForm(!showAddForm)}
                className="inline-flex items-center gap-2 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors font-medium"
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
                    d="M12 4v16m8-8H4"
                  />
                </svg>
                Add Expense
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Dashboard Stats */}
        <div className="mb-8">
          <Dashboard summary={summary} expenseCount={expenses.length} />
        </div>

        {/* Add Expense Form */}
        {showAddForm && (
          <div className="mb-8 bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Add New Expense</h2>
            <ExpenseForm
              onSubmit={handleAddExpense}
              onCancel={() => setShowAddForm(false)}
            />
          </div>
        )}

        {/* Analytics Section */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
          <div className="lg:col-span-2">
            <CategoryChart summary={summary} />
          </div>
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Stats</h3>
            <div className="space-y-4">
              <div>
                <p className="text-sm text-gray-600">Average per expense</p>
                <p className="text-xl font-bold text-gray-900">
                  ${expenses.length > 0 ? (summary.totalSpending / expenses.length).toFixed(2) : '0.00'}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Categories used</p>
                <p className="text-xl font-bold text-gray-900">
                  {summary.categoryBreakdown.length}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-600">This month's expenses</p>
                <p className="text-xl font-bold text-gray-900">
                  {expenses.filter(exp => {
                    const expDate = new Date(exp.date);
                    const now = new Date();
                    return expDate.getMonth() === now.getMonth() &&
                           expDate.getFullYear() === now.getFullYear();
                  }).length}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="mb-6">
          <ExpenseFiltersComponent
            filters={filters}
            onFiltersChange={setFilters}
            onReset={resetFilters}
          />
        </div>

        {/* Expenses List */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold text-gray-900">
              Expenses
              {filteredExpenses.length !== expenses.length && (
                <span className="ml-2 text-sm font-normal text-gray-500">
                  ({filteredExpenses.length} of {expenses.length})
                </span>
              )}
            </h2>
          </div>
          <ExpenseList
            expenses={filteredExpenses}
            onDelete={deleteExpense}
            onUpdate={updateExpense}
          />
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-gray-200 mt-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <p className="text-center text-sm text-gray-500">
            Expense Tracker - Built with Next.js, TypeScript, and Tailwind CSS
          </p>
        </div>
      </footer>

      {/* Cloud Export Hub */}
      <CloudExportHub
        expenses={expenses}
        isOpen={showCloudExport}
        onClose={() => setShowCloudExport(false)}
      />
    </div>
  );
}
