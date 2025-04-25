import api from '../config/api';

export interface Budget {
  id: string;
  name: string;
  amount: number;          // Montant initial du budget en DT
  remainingAmount: number; // Montant restant du budget en DT
  category: string;
  period: 'DAILY' | 'WEEKLY' | 'MONTHLY' | 'YEARLY';
  startDate: string;
  endDate?: string;
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
    return response.data.data.map((budget: any) => ({
      ...budget,
      id: budget._id,
      remainingAmount: budget.remainingAmount ?? budget.amount
    }));
  } catch (error) {
    console.error('Erreur lors de la récupération des budgets:', error);
    throw error;
  }
};

// Créer un nouveau budget
export const createBudget = async (budgetData: Omit<Budget, 'id'>): Promise<Budget> => {
  try {
    const response = await api.post('/budgets', budgetData);
    const createdBudget = response.data.data;
    return {
      ...createdBudget,
      id: createdBudget._id,
      remainingAmount: createdBudget.remainingAmount ?? createdBudget.amount
    };
  } catch (error) {
    console.error('Erreur lors de la création du budget:', error);
    throw error;
  }
};

// Mettre à jour un budget
export const updateBudget = async (id: string, budgetData: Partial<Budget>): Promise<Budget> => {
  try {
    const response = await api.put(`/budgets/${id}`, budgetData);
    const updatedBudget = response.data.data;
    return {
      ...updatedBudget,
      id: updatedBudget._id,
      remainingAmount: updatedBudget.remainingAmount ?? updatedBudget.amount
    };
  } catch (error) {
    console.error('Erreur lors de la mise à jour du budget:', error);
    throw error;
  }
};

// Déduire un montant du budget
export const deductFromBudget = async (id: string, amount: number): Promise<Budget> => {
  try {
    const response = await api.put(`/budgets/${id}/deduct`, { amount });
    const updatedBudget = response.data.data;
    return {
      ...updatedBudget,
      id: updatedBudget._id,
      remainingAmount: updatedBudget.amount - (updatedBudget.currentSpending || 0)
    };
  } catch (error) {
    console.error('Erreur lors de la déduction du budget:', error);
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