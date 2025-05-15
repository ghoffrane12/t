/**
 * Configuration de l'application
 */

// URL de l'API backend
export const API_URL = 'http://localhost:5000/api';

// Configuration des headers par défaut pour axios
export const getAuthHeader = () => ({
  headers: {
    Authorization: `Bearer ${localStorage.getItem('token')}`
  }
}); 