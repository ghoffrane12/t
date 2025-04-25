import api from '../config/api';
import axios, { AxiosError } from 'axios';

export interface SavingsGoal {
  id: string;
  title: string;
  targetAmount: number;
  currentAmount: number;
  deadline: string;
  category: string;
}

// Type pour les erreurs
interface ApiError {
  response?: {
    data: any;
    status: number;
  };
  message: string;
}

// Récupérer tous les objectifs d'épargne
export const getSavingsGoals = async (): Promise<SavingsGoal[]> => {
  try {
    console.log('Appel API GET /saving-goals');
    const response = await api.get('/saving-goals');
    console.log('Réponse API complète:', response);
    console.log('Données reçues:', response.data);
    
    // Si la réponse est un tableau, on l'utilise directement
    const goals = Array.isArray(response.data) ? response.data : 
                 // Sinon on cherche dans response.data.data
                 (response.data?.data || []);

    return goals.map((goal: any) => ({
      ...goal,
      id: goal._id || goal.id, // Accepte _id ou id
    }));
  } catch (error) {
    if (axios.isAxiosError(error)) {
      const apiError = error as AxiosError;
      console.error('Erreur détaillée lors de la récupération des objectifs d\'épargne:', apiError);
      console.error('Message d\'erreur:', apiError.message);
      if (apiError.response) {
        console.error('Données de réponse d\'erreur:', apiError.response.data);
        console.error('Status:', apiError.response.status);
      }
    }
    throw error;
  }
};

// Créer un nouvel objectif d'épargne
export const createSavingsGoal = async (goalData: Omit<SavingsGoal, 'id'>): Promise<SavingsGoal> => {
  try {
    console.log('Appel API POST /saving-goals avec les données:', goalData);
    const response = await api.post('/saving-goals', goalData);
    console.log('Réponse API complète:', response);
    console.log('Données reçues:', response.data);

    // Accepte soit un objet direct soit un objet dans .data
    const createdGoal = response.data?.data || response.data;
    
    return {
      ...createdGoal,
      id: createdGoal._id || createdGoal.id, // Accepte _id ou id
    };
  } catch (error) {
    if (axios.isAxiosError(error)) {
      const apiError = error as AxiosError;
      console.error('Erreur détaillée lors de la création de l\'objectif d\'épargne:', apiError);
      console.error('Message d\'erreur:', apiError.message);
      if (apiError.response) {
        console.error('Données de réponse d\'erreur:', apiError.response.data);
        console.error('Status:', apiError.response.status);
      }
    }
    throw error;
  }
};

// Mettre à jour un objectif d'épargne
export const updateSavingsGoal = async (id: string, goalData: Partial<SavingsGoal>): Promise<SavingsGoal> => {
  try {
    console.log(`Appel API PUT /saving-goals/${id} avec les données:`, goalData);
    const response = await api.put(`/saving-goals/${id}`, goalData);
    console.log('Réponse API complète:', response);
    console.log('Données reçues:', response.data);

    // Accepte soit un objet direct soit un objet dans .data
    const updatedGoal = response.data?.data || response.data;
    
    return {
      ...updatedGoal,
      id: updatedGoal._id || updatedGoal.id, // Accepte _id ou id
    };
  } catch (error) {
    if (axios.isAxiosError(error)) {
      const apiError = error as AxiosError;
      console.error('Erreur détaillée lors de la mise à jour de l\'objectif d\'épargne:', apiError);
      console.error('Message d\'erreur:', apiError.message);
      if (apiError.response) {
        console.error('Données de réponse d\'erreur:', apiError.response.data);
        console.error('Status:', apiError.response.status);
      }
    }
    throw error;
  }
};

// Supprimer un objectif d'épargne
export const deleteSavingsGoal = async (id: string): Promise<void> => {
  try {
    console.log(`Appel API DELETE /saving-goals/${id}`);
    const response = await api.delete(`/saving-goals/${id}`);
    console.log('Réponse API complète:', response);
  } catch (error) {
    if (axios.isAxiosError(error)) {
      const apiError = error as AxiosError;
      console.error('Erreur détaillée lors de la suppression de l\'objectif d\'épargne:', apiError);
      console.error('Message d\'erreur:', apiError.message);
      if (apiError.response) {
        console.error('Données de réponse d\'erreur:', apiError.response.data);
        console.error('Status:', apiError.response.status);
      }
    }
    throw error;
  }
}; 