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
 * @param {string} notificationId - ID de la notification à marquer comme lue
 * @returns {Promise<void>}
 */
export const markNotificationAsRead = async (notificationId: string): Promise<void> => {
  try {
    await axios.put(`${API_URL}/notifications/${notificationId}/read`, {}, getAuthHeader());
  } catch (error) {
    console.error('Erreur lors du marquage de la notification comme lue:', error);
    throw error;
  }
};

/**
 * Marque toutes les notifications comme lues
 * @returns {Promise<void>}
 */
export const markAllNotificationsAsRead = async (): Promise<void> => {
  try {
    const notifications = await getNotifications();
    await Promise.all(
      notifications
        .filter(notification => !notification.read)
        .map(notification => markNotificationAsRead(notification._id))
    );
  } catch (error) {
    console.error('Erreur lors du marquage de toutes les notifications comme lues:', error);
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