export interface Budget {
  id: string;
  name: string;
  amount: number;
  remainingAmount: number;
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