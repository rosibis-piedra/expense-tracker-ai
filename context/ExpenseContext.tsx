'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Expense, ExpenseFormData, ExpenseFilters, ExpenseSummary, Category } from '@/types/expense';
import { storage } from '@/lib/storage';
import { generateId, getMonthStart, getMonthEnd } from '@/lib/utils';

interface ExpenseContextType {
  expenses: Expense[];
  filteredExpenses: Expense[];
  filters: ExpenseFilters;
  summary: ExpenseSummary;
  isLoading: boolean;
  addExpense: (data: ExpenseFormData) => void;
  updateExpense: (id: string, data: ExpenseFormData) => void;
  deleteExpense: (id: string) => void;
  setFilters: (filters: ExpenseFilters) => void;
  resetFilters: () => void;
}

const ExpenseContext = createContext<ExpenseContextType | undefined>(undefined);

const initialFilters: ExpenseFilters = {
  category: 'All',
  startDate: '',
  endDate: '',
  searchQuery: '',
};

export function ExpenseProvider({ children }: { children: ReactNode }) {
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [filters, setFiltersState] = useState<ExpenseFilters>(initialFilters);
  const [isLoading, setIsLoading] = useState(true);

  // Load expenses from localStorage on mount
  useEffect(() => {
    const loadedExpenses = storage.getExpenses();
    setExpenses(loadedExpenses);
    setIsLoading(false);
  }, []);

  // Calculate filtered expenses
  const filteredExpenses = expenses.filter(expense => {
    // Category filter
    if (filters.category !== 'All' && expense.category !== filters.category) {
      return false;
    }

    // Date range filter
    if (filters.startDate && expense.date < filters.startDate) {
      return false;
    }
    if (filters.endDate && expense.date > filters.endDate) {
      return false;
    }

    // Search query filter
    if (filters.searchQuery) {
      const query = filters.searchQuery.toLowerCase();
      return (
        expense.description.toLowerCase().includes(query) ||
        expense.category.toLowerCase().includes(query)
      );
    }

    return true;
  });

  // Calculate summary statistics
  const summary: ExpenseSummary = React.useMemo(() => {
    const totalSpending = expenses.reduce((sum, exp) => sum + exp.amount, 0);

    const monthStart = getMonthStart();
    const monthEnd = getMonthEnd();
    const monthlyExpenses = expenses.filter(
      exp => exp.date >= monthStart && exp.date <= monthEnd
    );
    const monthlySpending = monthlyExpenses.reduce((sum, exp) => sum + exp.amount, 0);

    // Category breakdown
    const categoryTotals = new Map<Category, number>();
    expenses.forEach(exp => {
      categoryTotals.set(exp.category, (categoryTotals.get(exp.category) || 0) + exp.amount);
    });

    const categoryBreakdown = Array.from(categoryTotals.entries())
      .map(([category, amount]) => ({
        category,
        amount,
        percentage: totalSpending > 0 ? (amount / totalSpending) * 100 : 0,
      }))
      .sort((a, b) => b.amount - a.amount);

    const topCategory = categoryBreakdown.length > 0
      ? { name: categoryBreakdown[0].category, amount: categoryBreakdown[0].amount }
      : null;

    return {
      totalSpending,
      monthlySpending,
      topCategory,
      categoryBreakdown,
    };
  }, [expenses]);

  const addExpense = (data: ExpenseFormData) => {
    const newExpense: Expense = {
      id: generateId(),
      date: data.date,
      amount: parseFloat(data.amount),
      category: data.category,
      description: data.description,
      createdAt: new Date().toISOString(),
    };

    const updatedExpenses = [...expenses, newExpense];
    setExpenses(updatedExpenses);
    storage.saveExpenses(updatedExpenses);
  };

  const updateExpense = (id: string, data: ExpenseFormData) => {
    const expense = expenses.find(exp => exp.id === id);
    if (!expense) return;

    const updatedExpense: Expense = {
      ...expense,
      date: data.date,
      amount: parseFloat(data.amount),
      category: data.category,
      description: data.description,
    };

    const updatedExpenses = expenses.map(exp =>
      exp.id === id ? updatedExpense : exp
    );

    setExpenses(updatedExpenses);
    storage.saveExpenses(updatedExpenses);
  };

  const deleteExpense = (id: string) => {
    const updatedExpenses = expenses.filter(exp => exp.id !== id);
    setExpenses(updatedExpenses);
    storage.saveExpenses(updatedExpenses);
  };

  const setFilters = (newFilters: ExpenseFilters) => {
    setFiltersState(newFilters);
  };

  const resetFilters = () => {
    setFiltersState(initialFilters);
  };

  return (
    <ExpenseContext.Provider
      value={{
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
      }}
    >
      {children}
    </ExpenseContext.Provider>
  );
}

export function useExpenses() {
  const context = useContext(ExpenseContext);
  if (context === undefined) {
    throw new Error('useExpenses must be used within an ExpenseProvider');
  }
  return context;
}
