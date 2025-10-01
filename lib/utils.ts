import { Expense, Category } from '@/types/expense';

export const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(amount);
};

export const formatDate = (dateString: string): string => {
  const date = new Date(dateString);
  return new Intl.DateFormat('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  }).format(date);
};

export const generateId = (): string => {
  return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
};

export const isValidAmount = (amount: string): boolean => {
  const num = parseFloat(amount);
  return !isNaN(num) && num > 0;
};

export const getCategoryColor = (category: Category): string => {
  const colors: Record<Category, string> = {
    Food: 'bg-orange-500',
    Transportation: 'bg-blue-500',
    Entertainment: 'bg-purple-500',
    Shopping: 'bg-pink-500',
    Bills: 'bg-red-500',
    Other: 'bg-gray-500',
  };
  return colors[category];
};

export const getCategoryTextColor = (category: Category): string => {
  const colors: Record<Category, string> = {
    Food: 'text-orange-600',
    Transportation: 'text-blue-600',
    Entertainment: 'text-purple-600',
    Shopping: 'text-pink-600',
    Bills: 'text-red-600',
    Other: 'text-gray-600',
  };
  return colors[category];
};

export const getCategoryBgColor = (category: Category): string => {
  const colors: Record<Category, string> = {
    Food: 'bg-orange-100',
    Transportation: 'bg-blue-100',
    Entertainment: 'bg-purple-100',
    Shopping: 'bg-pink-100',
    Bills: 'bg-red-100',
    Other: 'bg-gray-100',
  };
  return colors[category];
};

export const exportToCSV = (expenses: Expense[]): void => {
  const headers = ['Date', 'Category', 'Description', 'Amount'];
  const rows = expenses.map(exp => [
    exp.date,
    exp.category,
    exp.description,
    exp.amount.toString(),
  ]);

  const csvContent = [
    headers.join(','),
    ...rows.map(row => row.map(cell => `"${cell}"`).join(',')),
  ].join('\n');

  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  const url = URL.createObjectURL(blob);

  link.setAttribute('href', url);
  link.setAttribute('download', `expenses-${new Date().toISOString().split('T')[0]}.csv`);
  link.style.visibility = 'hidden';

  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};

export const getMonthStart = (): string => {
  const now = new Date();
  return new Date(now.getFullYear(), now.getMonth(), 1).toISOString().split('T')[0];
};

export const getMonthEnd = (): string => {
  const now = new Date();
  return new Date(now.getFullYear(), now.getMonth() + 1, 0).toISOString().split('T')[0];
};

export const getTodayDate = (): string => {
  return new Date().toISOString().split('T')[0];
};
