import axios from 'axios';
import authService from './authService';

interface Transaction {
  _id: string;
  amount: number;
  description: string;
  date: string;
  type: 'EXPENSE' | 'INCOME';
  category: {
    id: string;
    name: string;
    icon: string;
    type: 'EXPENSE' | 'INCOME';
  };
  userId: string;
}

const API_URL = 'http://localhost:5000/api/transactions';

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

export const getAllTransactions = async (): Promise<Transaction[]> => {
  try {
    if (!authService.isAuthenticated()) {
      throw new Error('Veuillez vous connecter pour voir vos transactions.');
    }
    const response = await axios.get(API_URL, getAuthHeader());
    return response.data;
  } catch (error: any) {
    console.error('Erreur détaillée:', error.response || error);
    if (error.response?.status === 401) {
      authService.logout(); // Force logout on authentication error
      throw new Error('Session expirée. Veuillez vous reconnecter.');
    }
    throw new Error(
      error.response?.data?.message || 
      'Erreur lors de la récupération des transactions. Vérifiez que le serveur est bien lancé.'
    );
  }
};

export const createTransaction = async (transactionData: Omit<Transaction, '_id' | 'userId'>): Promise<Transaction> => {
  try {
    if (!authService.isAuthenticated()) {
      throw new Error('Veuillez vous connecter pour créer une transaction.');
    }
    const response = await axios.post(API_URL, transactionData, getAuthHeader());
    return response.data;
  } catch (error: any) {
    console.error('Erreur détaillée:', error.response || error);
    if (error.response?.status === 401) {
      authService.logout(); // Force logout on authentication error
      throw new Error('Session expirée. Veuillez vous reconnecter.');
    }
    throw new Error(
      error.response?.data?.message || 
      'Erreur lors de la création de la transaction. Vérifiez que le serveur est bien lancé.'
    );
  }
};

export const deleteTransaction = async (id: string): Promise<void> => {
  try {
    if (!authService.isAuthenticated()) {
      throw new Error('Veuillez vous connecter pour supprimer une transaction.');
    }
    await axios.delete(`${API_URL}/${id}`, getAuthHeader());
  } catch (error: any) {
    console.error('Erreur détaillée:', error.response || error);
    if (error.response?.status === 401) {
      authService.logout(); // Force logout on authentication error
      throw new Error('Session expirée. Veuillez vous reconnecter.');
    }
    throw new Error(
      error.response?.data?.message || 
      'Erreur lors de la suppression de la transaction. Vérifiez que le serveur est bien lancé.'
    );
  }
};

export type { Transaction }; 