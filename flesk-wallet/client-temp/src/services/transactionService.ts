import api from '../config/api';

export interface Transaction {
  id: string;
  category: string;
  date: string;
  description: string;
  amount: number;
  currency: string;
  type: 'revenu' | 'dépense';
}

export const getRecentTransactions = async (): Promise<Transaction[]> => {
  // Adapte l'URL selon ton backend
  const response = await api.get('/transactions/recent');
  return response.data.data || [];
}; 