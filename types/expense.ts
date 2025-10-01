export type Category =
  | 'Food'
  | 'Transportation'
  | 'Entertainment'
  | 'Shopping'
  | 'Bills'
  | 'Other';

export interface Expense {
  id: string;
  date: string;
  amount: number;
  category: Category;
  description: string;
  createdAt: string;
}

export interface ExpenseFormData {
  date: string;
  amount: string;
  category: Category;
  description: string;
}

export interface ExpenseFilters {
  category: Category | 'All';
  startDate: string;
  endDate: string;
  searchQuery: string;
}

export interface ExpenseSummary {
  totalSpending: number;
  monthlySpending: number;
  topCategory: {
    name: Category;
    amount: number;
  } | null;
  categoryBreakdown: {
    category: Category;
    amount: number;
    percentage: number;
  }[];
}
