import axios from 'axios';
import authService from './authService';

interface Subscription {
  _id: string;
  name: string;
  amount: number;
  frequency: 'MONTHLY' | 'YEARLY' | 'QUARTERLY';
  nextPaymentDate: string;
  category: 'ENTERTAINMENT' | 'FITNESS' | 'SERVICES' | 'EDUCATION' | 'OTHER';
  status: 'ACTIVE' | 'PAUSED' | 'CANCELLED';
  logo?: string;
  notes?: string;
  lastUsed?: string;
  userId: string;
}

interface SubscriptionStats {
  totalMonthly: number;
  categoryStats: {
    [key: string]: number;
  };
  upcomingPayments: Subscription[];
}

const API_URL = 'http://localhost:5000/api/subscriptions';

const getAuthHeader = () => {
  const token = authService.getToken();
  if (!token) {
    throw new Error('Non authentifié. Veuillez vous connecter.');
  }
  return {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };
};

export const getAllSubscriptions = async (): Promise<Subscription[]> => {
  try {
    const response = await axios.get(API_URL, getAuthHeader());
    return response.data;
  } catch (error: any) {
    console.error('Erreur détaillée:', error.response || error);
    throw new Error(
      error.response?.data?.message || 
      'Erreur lors de la récupération des abonnements'
    );
  }
};

export const getSubscriptionStats = async (): Promise<SubscriptionStats> => {
  try {
    const response = await axios.get(`${API_URL}/stats`, getAuthHeader());
    return response.data;
  } catch (error: any) {
    console.error('Erreur détaillée:', error.response || error);
    throw new Error(
      error.response?.data?.message || 
      'Erreur lors de la récupération des statistiques'
    );
  }
};

export const createSubscription = async (subscriptionData: Omit<Subscription, '_id' | 'userId'>): Promise<Subscription> => {
  try {
    const response = await axios.post(API_URL, subscriptionData, getAuthHeader());
    return response.data;
  } catch (error: any) {
    console.error('Erreur détaillée:', error.response || error);
    throw new Error(
      error.response?.data?.message || 
      'Erreur lors de la création de l\'abonnement'
    );
  }
};

export const updateSubscription = async (id: string, subscriptionData: Partial<Subscription>): Promise<Subscription> => {
  try {
    const response = await axios.put(`${API_URL}/${id}`, subscriptionData, getAuthHeader());
    return response.data;
  } catch (error: any) {
    console.error('Erreur détaillée:', error.response || error);
    throw new Error(
      error.response?.data?.message || 
      'Erreur lors de la mise à jour de l\'abonnement'
    );
  }
};

export const deleteSubscription = async (id: string): Promise<void> => {
  try {
    await axios.delete(`${API_URL}/${id}`, getAuthHeader());
  } catch (error: any) {
    console.error('Erreur détaillée:', error.response || error);
    throw new Error(
      error.response?.data?.message || 
      'Erreur lors de la suppression de l\'abonnement'
    );
  }
};

export const markSubscriptionAsUsed = async (id: string): Promise<Subscription> => {
  try {
    const response = await axios.patch(`${API_URL}/${id}/used`, {}, getAuthHeader());
    return response.data;
  } catch (error: any) {
    console.error('Erreur détaillée:', error.response || error);
    throw new Error(
      error.response?.data?.message || 
      'Erreur lors de la mise à jour de la date d\'utilisation'
    );
  }
};

export type { Subscription, SubscriptionStats }; 