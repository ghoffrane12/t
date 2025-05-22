const Notification = require('../models/Notification');
const logger = require('../utils/logger');

// Créer une notification
const createNotification = async (userId, type, title, message, category = null, location = null, goalId = null) => {
  try {
    logger.info('Création notification:', { type, title, userId });

    // Vérifier si une notification identique existe déjà (pour un objectif, on vérifie aussi goalId)
    const exists = await Notification.findOne({
      userId,
      type,
      title,
      message,
      category,
      location,
      goalId,
      createdAt: { $gte: new Date(Date.now() - 24 * 60 * 60 * 1000) } // Vérifier les doublons sur les dernières 24h
    });

    if (exists) {
      logger.info('Notification similaire existe déjà, doublon évité');
      return exists;
    }

    const notification = new Notification({
      userId,
      type,
      title,
      message,
      category,
      location,
      goalId,
      read: false
    });
    await notification.save();
    logger.info('Notification créée avec succès:', notification._id);
    return notification;
  } catch (error) {
    logger.error('Erreur lors de la création de la notification:', error);
    throw error;
  }
};

// Notification de dépassement de budget
const createBudgetExceededNotification = async (userId, budget) => {
  try {
    logger.info('Création notification dépassement budget:', budget._id);
    const title = 'Budget dépassé';
    const message = `Vous avez dépassé votre budget "${budget.name}" de ${budget.category}. Montant dépassé : ${budget.remainingAmount} DT`;
    return await createNotification(userId, 'depassement', title, message, budget.category);
  } catch (error) {
    logger.error('Erreur lors de la création de la notification de dépassement:', error);
    throw error;
  }
};

// Notification d'objectif atteint
const createGoalAchievedNotification = async (userId, goal) => {
  try {
    logger.info('Création notification objectif atteint:', goal._id);
    const title = 'Objectif atteint !';
    const message = `Félicitations ! Vous avez atteint votre objectif "${goal.title}". Montant atteint: ${goal.currentAmount} DT`;
    return await createNotification(userId, 'objectif_atteint', title, message);
  } catch (error) {
    logger.error('Erreur lors de la création de la notification d\'objectif atteint:', error);
    throw error;
  }
};

// Notification de rappel de paiement
const createPaymentReminderNotification = async (userId, subscription) => {
  try {
    logger.info('Création notification rappel paiement:', subscription._id);
    const title = 'Rappel de paiement';
    
    const now = new Date();
    const nextPaymentDate = new Date(subscription.nextPaymentDate);
    
    const diffTime = nextPaymentDate.getTime() - now.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    let message;
    if (diffDays === 0) {
      message = `Votre abonnement "${subscription.name}" sera renouvelé aujourd\'hui. Montant: ${subscription.amount} DT`;
    } else if (diffDays === 1) {
      message = `Votre abonnement "${subscription.name}" sera renouvelé demain. Montant: ${subscription.amount} DT`;
    } else if (diffDays === 2) {
      message = `Votre abonnement "${subscription.name}" sera renouvelé dans 2 jours (${nextPaymentDate.toLocaleDateString('fr-FR')}). Montant: ${subscription.amount} DT`;
    } else {
       // Cas par défaut si nécessaire, ou on ne crée pas de notification ici si ce n'est pas aujourd'hui, demain ou J+2
       // Pour l'instant, on garde le message J+2 comme fallback si la différence est > 2 mais ce n'est pas idéal. Ajustons cela.
       return null; // Ne crée pas de notification si l'échéance n'est pas aujourd'hui, demain ou J+2
    }

    return await createNotification(userId, 'abonnement', title, message);
  } catch (error) {
    logger.error('Erreur lors de la création de la notification de rappel de paiement:', error);
    throw error;
  }
};

// Notification d'alerte de sécurité
const createSecurityAlertNotification = async (userId, alertType, details) => {
  try {
    logger.info('Création notification alerte sécurité:', alertType);
    const title = 'Alerte de sécurité';
    let message = '';
    
    switch (alertType) {
      case 'login_attempt':
        message = `Une tentative de connexion a été détectée depuis ${details.location} à ${new Date().toLocaleTimeString('fr-FR')}`;
        break;
      case 'unusual_activity':
        message = `Une activité inhabituelle a été détectée sur votre compte: ${details.description}`;
        break;
      case 'password_change':
        message = 'Votre mot de passe a été modifié';
        break;
      default:
        message = 'Une alerte de sécurité a été déclenchée';
    }
    
    return await createNotification(userId, 'securite', title, message);
  } catch (error) {
    logger.error('Erreur lors de la création de la notification d\'alerte de sécurité:', error);
    throw error;
  }
};

// Notification de rappel d'objectif
const createGoalReminderNotification = async (userId, goal) => {
  try {
    logger.info('Création notification rappel objectif:', goal._id);
    const title = 'Rappel d\'objectif';
    const message = `Votre objectif "${goal.title}" se termine dans ${goal.daysRemaining} jours. Progression: ${goal.currentAmount}/${goal.targetAmount} DT`;
    return await createNotification(userId, 'rappel', title, message);
  } catch (error) {
    logger.error('Erreur lors de la création de la notification de rappel d\'objectif:', error);
    throw error;
  }
};

// Notification d'échec d'objectif
const createGoalFailedNotification = async (userId, goal) => {
  try {
    logger.info('Création notification échec objectif:', goal._id);
    const title = 'Objectif non atteint';
    const message = `Votre objectif "${goal.title}" est arrivé à échéance. Vous avez atteint ${goal.currentAmount} DT sur ${goal.targetAmount} DT`;
    return await createNotification(userId, 'objectif_echoue', title, message, null, null, goal._id);
  } catch (error) {
    logger.error('Erreur lors de la création de la notification d\'échec d\'objectif:', error);
    throw error;
  }
};

module.exports = {
  createNotification,
  createBudgetExceededNotification,
  createGoalAchievedNotification,
  createPaymentReminderNotification,
  createSecurityAlertNotification,
  createGoalReminderNotification,
  createGoalFailedNotification
}; 