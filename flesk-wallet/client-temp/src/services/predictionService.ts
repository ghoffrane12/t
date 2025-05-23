// Type de retour simplifié pour correspondre au besoin
export interface CategoryPrediction {
    category: string;
    amount: number;
  }
  
  export async function getNextMonthPredictions(): Promise<CategoryPrediction[]> {
    try {
        const token = localStorage.getItem('token'); // ou sessionStorage, selon ton app

const res = await fetch('/api/prediction/next-month', {
  method: 'GET',
  headers: {
    'Authorization': `Bearer ${token}`,
  },
});

        const data = await res.json();
  
      if (data && data.predictions) {
        return Object.entries(data.predictions).map(([category, amount]) => ({
          category,
          amount: Number(amount), // Conversion explicite
        }));
      } else {
        console.error("Structure de réponse inattendue:", data);
        return [];
      }
    } catch (error) {
      console.error("Erreur lors de la récupération des prédictions:", error);
      return [];
    }
  }
  