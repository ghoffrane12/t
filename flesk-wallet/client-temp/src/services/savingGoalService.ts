import axios from 'axios';
import authService from './authService';

export interface SavingGoal {
  _id: string;
  name: string;
  targetAmount: number;
  currentAmount: number;
  deadline: string;
  category: 'VOYAGE' | 'VOITURE' | 'MAISON' | 'EDUCATION' | 'AUTRE';
  status: 'EN_COURS' | 'ATTEINT' | 'EN_RETARD';
  description?: string;
  monthlyContribution: number;
  userId: string;
}

export interface CategoryTrend {
  current: number;
  previous: number;
  trend: number;
}

export interface Insight {
  category: string;
  message: string;
  type: 'WARNING' | 'SUCCESS';
}

export interface Prediction {
  predictedAmount: number;
  confidence: 'ÉLEVÉ' | 'MOYEN' | 'FAIBLE';
}

export interface AnalysisData {
  trends: { [category: string]: CategoryTrend };
  insights: Insight[];
  predictions: { [category: string]: Prediction };
}

const API_URL = 'http://localhost:5000/api/saving-goals';

const getAuthHeader = () => {
  const token = authService.getToken();
  if (!token) {
    throw new Error('Non authentifié');
  }
  return {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };
};

export const getAllSavingGoals = async (): Promise<SavingGoal[]> => {
  try {
    const response = await axios.get(API_URL, getAuthHeader());
    return response.data;
  } catch (error: any) {
    console.error('Erreur détaillée:', error.response || error);
    throw new Error(
      error.response?.data?.message || 
      "Erreur lors de la récupération des objectifs d'épargne"
    );
  }
};

export const createSavingGoal = async (goalData: Omit<SavingGoal, '_id' | 'userId' | 'currentAmount' | 'status'>): Promise<SavingGoal> => {
  try {
    const response = await axios.post(API_URL, goalData, getAuthHeader());
    return response.data;
  } catch (error: any) {
    console.error('Erreur détaillée:', error.response || error);
    throw new Error(
      error.response?.data?.message || 
      "Erreur lors de la création de l'objectif d'épargne"
    );
  }
};

export const updateSavingGoal = async (id: string, goalData: Partial<SavingGoal>): Promise<SavingGoal> => {
  try {
    const response = await axios.put(`${API_URL}/${id}`, goalData, getAuthHeader());
    return response.data;
  } catch (error: any) {
    console.error('Erreur détaillée:', error.response || error);
    throw new Error(
      error.response?.data?.message || 
      "Erreur lors de la mise à jour de l'objectif d'épargne"
    );
  }
};

export const deleteSavingGoal = async (id: string): Promise<void> => {
  try {
    await axios.delete(`${API_URL}/${id}`, getAuthHeader());
  } catch (error: any) {
    console.error('Erreur détaillée:', error.response || error);
    throw new Error(
      error.response?.data?.message || 
      "Erreur lors de la suppression de l'objectif d'épargne"
    );
  }
};

export const getAnalysis = async (): Promise<AnalysisData> => {
  try {
    const response = await axios.get(`${API_URL}/analysis`, getAuthHeader());
    return response.data;
  } catch (error: any) {
    console.error('Erreur détaillée:', error.response || error);
    throw new Error(
      error.response?.data?.message || 
      "Erreur lors de la récupération des analyses"
    );
  }
}; 