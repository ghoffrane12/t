import api from '../config/api';

interface PredictionResponse {
  globalPrediction: number;
  categoryPredictions: Record<string, number>; // Plus flexible que { [key: string]: number }
}

export const predictExpenses = async (): Promise<PredictionResponse> => {
  try {
    const response = await api.get('/predictions/predict');
    
    // Validation robuste de la réponse
    if (!response.data || typeof response.data.globalPrediction !== 'number') {
      throw new Error('Réponse API invalide : structure de données incorrecte');
    }

    // Conversion des nombres et nettoyage des valeurs
    const categoryPredictions: Record<string, number> = {};
    
    for (const [category, amount] of Object.entries(response.data.categoryPredictions)) {
      const numericValue = Number(amount);
      categoryPredictions[category] = isNaN(numericValue) ? 0 : numericValue;
    }

    return {
      globalPrediction: Number(response.data.globalPrediction),
      categoryPredictions
    };
  } catch (error) {
    // Gestion d'erreur améliorée
    const axiosError = error as {
      response?: {
        status?: number;
        data?: { message?: string };
      };
      message?: string;
    };

    console.error('Erreur de prédiction:', {
      endpoint: '/predictions/predict',
      status: axiosError.response?.status,
      errorData: axiosError.response?.data,
    });

    // Messages d'erreur contextualisés
    const errorMessages = {
      404: 'Service de prédiction temporairement indisponible',
      500: 'Erreur interne du serveur',
      default: 'Impossible d\'obtenir les prévisions'
    };

    throw new Error(
      axiosError.response?.data?.message ||
      errorMessages[axiosError.response?.status as keyof typeof errorMessages] ||
      errorMessages.default
    );
  }
};