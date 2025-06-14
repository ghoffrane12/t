import api from '../config/api';
import axios from 'axios';

export interface Budget {
  id: string; // Changé de _id à id
  userId: string;
  name: string;
  amount: number;          // Montant initial du budget en DT
  remainingAmount: number; // Montant restant du budget en DT
  currentSpent: number; // Montant actuellement dépensé
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

export type BudgetCreatePayload = {
  name: string;
  amount: number;
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
};

// Récupérer tous les budgets
export const getBudgets = async (): Promise<Budget[]> => {
  try {
    const response = await api.get('/budgets');
    return response.data.data.map((budget: any) => ({
      ...budget,
      id: budget._id, // Conversion de _id en id
      remainingAmount: budget.remainingAmount ?? budget.amount
    }));
  } catch (error) {
    console.error('Erreur lors de la récupération des budgets:', error);
    throw error;
  }
};

// Créer un nouveau budget
export const createBudget = async (budgetData: BudgetCreatePayload): Promise<Budget> => {
  try {
    const response = await api.post('/budgets', budgetData);
    const createdBudget = response.data.data;
    return {
      ...createdBudget,
      id: createdBudget._id, // Conversion de _id en id
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
      id: updatedBudget._id, // Conversion de _id en id
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
      id: updatedBudget._id, // Conversion de _id en id
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

// Vérifier l'existence d'un budget pour une catégorie
export const getBudgetByCategory = async (category: string): Promise<Budget | null> => {
  try {
    const response = await api.get(`/budgets/category/${category}`);
    return response.data.data;
  } catch (error) {
    if (axios.isAxiosError(error) && error.response?.status === 404) {
      return null;
    }
    throw error;
  }
}; 