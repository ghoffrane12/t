const NotificationService = require('../services/notificationService');

// Récupérer les notifications d'un utilisateur
exports.getNotifications = async (req, res) => {
  try {
    const { page, limit, read, type } = req.query;
    const options = {
      page: parseInt(page) || 1,
      limit: parseInt(limit) || 10,
      read: read === 'true' ? true : read === 'false' ? false : null,
      type: type || null
    };

    const result = await NotificationService.getUserNotifications(req.user._id, options);
    res.json(result);
  } catch (error) {
    console.error('Erreur lors de la récupération des notifications:', error);
    res.status(500).json({ message: 'Erreur lors de la récupération des notifications' });
  }
};

// Marquer une notification comme lue
exports.markAsRead = async (req, res) => {
  try {
    const { notificationId } = req.params;
    const notification = await NotificationService.markAsRead(notificationId, req.user._id);
    res.json(notification);
  } catch (error) {
    console.error('Erreur lors du marquage de la notification comme lue:', error);
    res.status(500).json({ message: 'Erreur lors du marquage de la notification comme lue' });
  }
};

// Marquer toutes les notifications comme lues
exports.markAllAsRead = async (req, res) => {
  try {
    const result = await NotificationService.markAllAsRead(req.user._id);
    res.json({ message: 'Toutes les notifications ont été marquées comme lues', count: result.nModified });
  } catch (error) {
    console.error('Erreur lors du marquage de toutes les notifications comme lues:', error);
    res.status(500).json({ message: 'Erreur lors du marquage de toutes les notifications comme lues' });
  }
};

// Supprimer une notification
exports.deleteNotification = async (req, res) => {
  try {
    const { notificationId } = req.params;
    await NotificationService.deleteNotification(notificationId, req.user._id);
    res.json({ message: 'Notification supprimée avec succès' });
  } catch (error) {
    console.error('Erreur lors de la suppression de la notification:', error);
    res.status(500).json({ message: 'Erreur lors de la suppression de la notification' });
  }
};

// Supprimer toutes les notifications lues
exports.deleteAllReadNotifications = async (req, res) => {
  try {
    const result = await NotificationService.deleteAllReadNotifications(req.user._id);
    res.json({ message: 'Toutes les notifications lues ont été supprimées', count: result.deletedCount });
  } catch (error) {
    console.error('Erreur lors de la suppression des notifications lues:', error);
    res.status(500).json({ message: 'Erreur lors de la suppression des notifications lues' });
  }
}; 