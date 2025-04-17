import { Notification, NotificationType } from '../types/notification';
import { formatCurrency } from '../utils/currency';

// Données mockées pour le développement
let notifications: Notification[] = [
  {
    id: '1',
    type: 'BUDGET_ALERT',
    title: 'Alerte Budget',
    message: 'Attention ! Vous avez dépensé 95% de votre budget Courses (475 TND/500 TND).',
    timestamp: new Date(),
    isRead: true,
    data: {
      budgetId: '1',
      category: 'Courses',
      amount: 475,
      threshold: 95
    }
  },
  {
    id: '2',
    type: 'UNUSUAL_TRANSACTION',
    title: 'Transaction Inhabituelle',
    message: 'Alerte : Une transaction de 300 TND chez "LuxeWatches" a été détectée. Confirmez ?',
    timestamp: new Date(),
    isRead: false,
    data: {
      transactionId: '123',
      amount: 300
    }
  },
  {
    id: '3',
    type: 'SUBSCRIPTION_REMINDER',
    title: 'Rappel Abonnement',
    message: 'Votre abonnement mensuel de 50 TND sera prélevé demain.',
    timestamp: new Date(),
    isRead: false,
    data: {
      transactionId: '456',
      amount: 50
    }
  },
  {
    id: '4',
    type: 'BUDGET_ALERT',
    title: 'Alerte Budget',
    message: 'Attention ! Vous avez dépensé 85% de votre budget Restaurants (170 TND/200 TND).',
    timestamp: new Date(),
    isRead: true,
    data: {
      budgetId: '3',
      category: 'Restaurants',
      amount: 170,
      threshold: 85
    }
  }
];

export const getNotifications = async (): Promise<Notification[]> => {
  return notifications;
};

export const markAsRead = async (notificationId: string): Promise<void> => {
  notifications = notifications.map(notif => 
    notif.id === notificationId ? { ...notif, isRead: true } : notif
  );
};

export const deleteNotification = async (notificationId: string): Promise<void> => {
  notifications = notifications.filter(notif => notif.id !== notificationId);
};

export const createBudgetAlert = async (
  budgetId: string,
  category: string,
  spent: number,
  total: number
): Promise<Notification> => {
  const percentage = Math.round((spent / total) * 100);
  const notification: Notification = {
    id: Date.now().toString(),
    type: 'BUDGET_ALERT',
    title: 'Alerte Budget',
    message: `Attention ! Vous avez dépensé ${percentage}% de votre budget ${category} (${formatCurrency(spent)}/${formatCurrency(total)}).`,
    timestamp: new Date(),
    isRead: false,
    data: {
      budgetId,
      category,
      amount: spent,
      threshold: percentage
    }
  };
  notifications.push(notification);
  return notification;
};

// Fonction pour vérifier si une notification de budget doit être envoyée
export const checkBudgetThreshold = async (
  budgetId: string,
  category: string,
  spent: number,
  total: number
): Promise<Notification | null> => {
  const percentage = (spent / total) * 100;
  if (percentage >= 80 && percentage < 100) {
    return createBudgetAlert(budgetId, category, spent, total);
  }
  return null;
}; 