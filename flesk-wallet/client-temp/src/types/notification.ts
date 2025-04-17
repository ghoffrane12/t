export type NotificationType = 
  | 'BUDGET_ALERT'      // Dépassement de budget
  | 'UNUSUAL_TRANSACTION'  // Transaction inhabituelle
  | 'SUBSCRIPTION_REMINDER' // Abonnement récurrent
  | 'SAVING_OPPORTUNITY'    // Opportunité d'économie
  | 'BALANCE_PREDICTION';   // Prédiction de solde

export interface Notification {
  id: string;
  type: NotificationType;
  title: string;
  message: string;
  timestamp: Date;
  isRead: boolean;
  data?: {
    budgetId?: string;
    transactionId?: string;
    amount?: number;
    category?: string;
    threshold?: number;
  };
} 