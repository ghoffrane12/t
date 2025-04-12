// shared/constants.js

module.exports = {
    // Catégories de transactions
    TRANSACTION_CATEGORIES: {
      FOOD: 'Alimentation',
      TRANSPORT: 'Transport',
      HOUSING: 'Logement',
      ENTERTAINMENT: 'Loisirs',
      HEALTH: 'Santé',
      EDUCATION: 'Éducation',
      SHOPPING: 'Shopping',
      SUBSCRIPTION: 'Abonnements',
      OTHER: 'Autre'
    },
  
    // Types de transactions
    TRANSACTION_TYPES: {
      INCOME: 'income',
      EXPENSE: 'expense'
    },
  
    // Paramètres de budget par défaut
    DEFAULT_BUDGET_SETTINGS: {
      MONTHLY_LIMIT: 1000, // Limite mensuelle par défaut
      WARNING_THRESHOLD: 0.8 // Seuil d'avertissement (80% du budget)
    },
  
    // Paramètres de notification
    NOTIFICATION_TYPES: {
      BUDGET_ALERT: 'budget_alert',
      SUBSCRIPTION_REMINDER: 'subscription_reminder',
      ABNORMAL_SPENDING: 'abnormal_spending',
      SAVINGS_TIP: 'savings_tip'
    },
  
    // Paramètres d'IA
    AI_SETTINGS: {
      SPENDING_ANALYSIS_DAYS: 90, // Période d'analyse des dépenses (jours)
      PREDICTION_HORIZON: 30 // Horizon de prédiction (jours)
    },
  
    // Messages d'erreur standard
    ERROR_MESSAGES: {
      UNAUTHORIZED: 'Accès non autorisé',
      INVALID_INPUT: 'Données d\'entrée invalides',
      NOT_FOUND: 'Ressource non trouvée'
    },
  
    // Codes de statut personnalisés
    STATUS_CODES: {
      SUCCESS: 200,
      CREATED: 201,
      BAD_REQUEST: 400,
      UNAUTHORIZED: 401,
      FORBIDDEN: 403,
      NOT_FOUND: 404,
      INTERNAL_ERROR: 500
    },
  
    // Configuration des devises
    CURRENCY: {
      DEFAULT: 'EUR',
      SYMBOL: '€',
      DECIMAL_PLACES: 2
    }
  };
  
  // Pour utilisation côté frontend (si vous utilisez ES modules)
  export const TRANSACTION_CATEGORIES = {
    FOOD: 'Alimentation',
    TRANSPORT: 'Transport',
    // ... etc (même structure que ci-dessus)
  };