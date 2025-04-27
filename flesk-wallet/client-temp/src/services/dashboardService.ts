import { getExpenses } from './expensesService';
import { getSubscriptions } from './subscriptionsService';
import { getRevenues, Revenue } from './revenuesService';

export interface DashboardTotals {
  balance: number;
  totalExpenses: number;
  totalRevenues: number;
  totalSubscriptions: number;
}

export const calculateDashboardTotals = async (): Promise<DashboardTotals> => {
  try {
    // Récupérer toutes les données nécessaires
    const [expenses, subscriptions, revenues] = await Promise.all([
      getExpenses(),
      getSubscriptions(),
      getRevenues()
    ]);

    // Calculer le total des dépenses
    const totalExpenses = expenses
      .reduce((sum: number, expense) => sum + expense.amount, 0);

    // Calculer le total des dépenses par catégorie
    const expensesByCategory = expenses.reduce((acc: { [key: string]: number }, expense) => {
      const category = expense.category;
      acc[category] = (acc[category] || 0) + expense.amount;
      return acc;
    }, {});

    // Calculer le total des abonnements actifs
    const totalSubscriptions = subscriptions
      .filter(subscription => subscription.isActive)
      .reduce((sum: number, subscription) => sum + subscription.amount, 0);

    // Calculer le total des revenus
    const totalRevenues = revenues
      .reduce((sum: number, revenue: Revenue) => sum + revenue.amount, 0);

    // Calculer le solde total (revenus - (dépenses + abonnements))
    const balance = totalRevenues - (totalExpenses + totalSubscriptions);

    return {
      balance,
      totalExpenses,
      totalRevenues,
      totalSubscriptions
    };
  } catch (error) {
    console.error('Erreur lors du calcul des totaux:', error);
    throw error;
  }
}; 