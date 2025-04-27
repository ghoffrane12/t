import axios from 'axios';

export interface Subscription {
  _id?: string;
  name: string;
  amount: number;
  category: string;
  frequency: 'monthly' | 'yearly';
  startDate: string;
  nextPaymentDate: string;
  isActive: boolean;
  description: string;
  user?: string;
  createdAt?: string;
  updatedAt?: string;
}

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

// Configure axios pour inclure le token dans toutes les requêtes
axios.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export const getSubscriptions = async (): Promise<Subscription[]> => {
  const response = await axios.get(`${API_URL}/subscriptions`);
  return response.data;
};

export const createSubscription = async (subscription: Omit<Subscription, '_id' | 'user' | 'nextPaymentDate' | 'createdAt' | 'updatedAt'>): Promise<Subscription> => {
  const response = await axios.post(`${API_URL}/subscriptions`, subscription);
  return response.data;
};

export const updateSubscription = async (id: string, subscription: Partial<Omit<Subscription, '_id' | 'user' | 'createdAt' | 'updatedAt'>>): Promise<Subscription> => {
  const response = await axios.put(`${API_URL}/subscriptions/${id}`, subscription);
  return response.data;
};

export const deleteSubscription = async (id: string): Promise<void> => {
  await axios.delete(`${API_URL}/subscriptions/${id}`);
};

export const subscriptionCategories = [
  "Streaming",
  "Téléphonie",
  "Internet",
  "Assurance",
  "Salle de sport",
  "Transport",
  "Services Cloud",
  "Divertissement",
  "Autre"
]; 