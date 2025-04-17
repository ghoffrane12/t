export type TransactionType = 'EXPENSE' | 'INCOME';

export type TransactionCategory = {
  id: string;
  name: string;
  icon: string;
  type: TransactionType;
};

export interface Transaction {
  id: string;
  amount: number;
  type: TransactionType;
  category: TransactionCategory;
  description: string;
  date: string;
  createdAt: string;
  updatedAt: string;
}

export interface TransactionFormData {
  amount: number;
  type: TransactionType;
  categoryId: string;
  description: string;
  date: string;
} 