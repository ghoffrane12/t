import axios from 'axios';

export interface Expense {
  _id?: string;
  nom: string;
  description: string;
  amount: number;
  category: string;
  date: string;
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

export const getExpenses = async (): Promise<Expense[]> => {
  const response = await axios.get(`${API_URL}/expenses`);
  return response.data;
};

export const createExpense = async (expense: Omit<Expense, '_id' | 'user' | 'createdAt' | 'updatedAt'>): Promise<Expense> => {
  const response = await axios.post(`${API_URL}/expenses`, expense);
  return response.data;
};

export const updateExpense = async (id: string, expense: Partial<Omit<Expense, '_id' | 'user' | 'createdAt' | 'updatedAt'>>): Promise<Expense> => {
  const response = await axios.put(`${API_URL}/expenses/${id}`, expense);
  return response.data;
};

export const deleteExpense = async (id: string): Promise<void> => {
  await axios.delete(`${API_URL}/expenses/${id}`);
};

export const expenseCategories = [
  "Alimentation",
  "Transport",
  "Logement",
  "Loisirs",
  "Santé",
  "Éducation",
  "Shopping",
  "Factures",
  "Abonnements",
  "Autre"
]; 