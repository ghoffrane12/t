import api from '../config/api';

export interface Budget {
  id: string;
  name: string;
  amount: number;
  category: string;
  period: 'DAILY' | 'WEEKLY' | 'MONTHLY' | 'YEARLY';
  startDate: string;
  endDate?: string;
  currentSpending: number;
  status: 'ACTIVE' | 'INACTIVE' | 'COMPLETED';
  notifications: {
    enabled: boolean;
    threshold: number;
  };
  description?: string;
  tags: string[];
}

// Récupérer tous les budgets
export const getBudgets = async (): Promise<Budget[]> => {
  try {
    const response = await api.get('/budgets');
    return response.data;
  } catch (error) {
    console.error('Erreur lors de la récupération des budgets:', error);
    throw error;
  }
};

// Créer un nouveau budget
export const createBudget = async (budgetData: Omit<Budget, 'id' | 'currentSpending'>): Promise<Budget> => {
  try {
    const response = await api.post('/budgets', budgetData);
    return response.data;
  } catch (error) {
    console.error('Erreur lors de la création du budget:', error);
    throw error;
  }
};

// Mettre à jour un budget
export const updateBudget = async (id: string, budgetData: Partial<Budget>): Promise<Budget> => {
  try {
    const response = await api.put(`/budgets/${id}`, budgetData);
    return response.data;
  } catch (error) {
    console.error('Erreur lors de la mise à jour du budget:', error);
    throw error;
  }
};

// Supprimer un budget
export const deleteBudget = async (id: string): Promise<void> => {
  try {
    await api.delete(`/budgets/${id}`);
  } catch (error) {
    console.error('Erreur lors de la suppression du budget:', error);
    throw error;
  }
}; 