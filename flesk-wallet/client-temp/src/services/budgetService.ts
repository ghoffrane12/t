import { Budget } from '../types/budget';

// Données fictives pour démarrer
let budgets: Budget[] = [
  {
    id: '1',
    category: 'Courses',
    amount: 500,
    spent: 215,
    period: 'monthly',
  },
  {
    id: '2',
    category: 'Transport',
    amount: 150,
    spent: 85,
    period: 'monthly',
  },
  {
    id: '3',
    category: 'Restaurants',
    amount: 200,
    spent: 125,
    period: 'monthly',
  }
];

export const getBudgets = async (): Promise<Budget[]> => {
  return budgets;
};

export const createBudget = async (budget: Omit<Budget, 'id' | 'spent'>): Promise<Budget> => {
  const newBudget: Budget = {
    ...budget,
    id: Date.now().toString(),
    spent: 0,
  };
  budgets.push(newBudget);
  return newBudget;
};

export const updateBudget = async (id: string, updates: Partial<Omit<Budget, 'id'>>): Promise<Budget | null> => {
  const index = budgets.findIndex((b) => b.id === id);
  if (index === -1) return null;
  budgets[index] = { ...budgets[index], ...updates };
  return budgets[index];
};

export const deleteBudget = async (id: string): Promise<boolean> => {
  const initialLength = budgets.length;
  budgets = budgets.filter((b) => b.id !== id);
  return budgets.length < initialLength;
}; 