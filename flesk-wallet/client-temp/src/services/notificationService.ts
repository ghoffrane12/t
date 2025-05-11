import axios from 'axios';

// URL de l'API backend
const API_URL = 'http://localhost:5000/api';

// Configuration des headers d'authentification
const getAuthHeader = () => ({
  headers: {
    Authorization: `Bearer ${localStorage.getItem('token')}`
  }
});

/**
 * Interface pour une notification
 */
export interface Notification {
  _id: string;
  userId: string;
  date: string;
  type: 'abonnement' | 'depassement' | 'objectif_atteint';
  title: string;
  message: string;
  category?: string;
  location?: string;
  read: boolean;
}

/**
 * Récupère toutes les notifications de l'utilisateur connecté
 * @returns {Promise<Notification[]>} Liste des notifications
 */
export const getNotifications = async (): Promise<Notification[]> => {
  try {
    const response = await axios.get(`${API_URL}/notifications`, getAuthHeader());
    return response.data;
  } catch (error) {
    console.error('Erreur lors de la récupération des notifications:', error);
    throw error;
  }
};

/**
 * Marque une notification comme lue
 * @param {string} id - ID de la notification
 * @returns {Promise<{success: boolean}>} Résultat de l'opération
 */
export const markAsRead = async (id: string): Promise<{success: boolean}> => {
  try {
    const response = await axios.put(`${API_URL}/notifications/${id}/read`, {}, getAuthHeader());
    return response.data;
  } catch (error) {
    console.error('Erreur lors du marquage comme lu:', error);
    throw error;
  }
};

/**
 * Supprime une notification
 * @param {string} id - ID de la notification
 * @returns {Promise<{success: boolean}>} Résultat de l'opération
 */
export const deleteNotification = async (id: string): Promise<{success: boolean}> => {
  try {
    const response = await axios.delete(`${API_URL}/notifications/${id}`, getAuthHeader());
    return response.data;
  } catch (error) {
    console.error('Erreur lors de la suppression:', error);
    throw error;
  }
}; 