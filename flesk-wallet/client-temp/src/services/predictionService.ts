import api from '../config/api';

export const predictExpenses = async (): Promise<number> => {
  try {
    const response = await api.get('/predictions/predict');
    return response.data.prediction;
  } catch (error) {
    console.error('Erreur lors de la prédiction:', error);
    throw new Error('Erreur lors de la prédiction des dépenses');
  }
}; 