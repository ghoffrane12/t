const Notification = require('../models/Notification');

// Créer une notification
const createNotification = async (userId, type, title, message, category = null, location = null, goalId = null) => {
  try {
    // Vérifier si une notification identique existe déjà (pour un objectif, on vérifie aussi goalId)
    const exists = await Notification.findOne({
      userId,
      type,
      title,
      message,
      category,
      location,
      goalId
    });
    if (exists) {
      return exists; // Ne crée pas de doublon
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
    return notification;
  } catch (error) {
    console.error('Erreur lors de la création de la notification:', error);
    throw error;
  }
};

// Notification de dépassement de budget
const createBudgetExceededNotification = async (userId, budget) => {
  const title = 'Budget dépassé';
  const message = `Vous avez dépassé votre budget "${budget.name}" de ${budget.category}. Montant dépassé : ${budget.remainingAmount} DT`;
  return createNotification(userId, 'depassement', title, message, budget.category);
};

// Notification d'objectif atteint
const createGoalAchievedNotification = async (userId, goal) => {
  const title = 'Objectif atteint !';
  const message = `Félicitations ! Vous avez atteint votre objectif "${goal.title}". Montant atteint: ${goal.currentAmount} DT`;
  return createNotification(userId, 'objectif_atteint', title, message);
};

// Notification de rappel de paiement
const createPaymentReminderNotification = async (userId, subscription) => {
  const title = 'Rappel de paiement';
  const message = `Votre abonnement "${subscription.name}" sera renouvelé le ${new Date(subscription.nextPaymentDate).toLocaleDateString('fr-FR')}. Montant: ${subscription.amount} DT`;
  return createNotification(userId, 'abonnement', title, message);
};

// Notification d'alerte de sécurité
const createSecurityAlertNotification = async (userId, alertType, details) => {
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
  
  return createNotification(userId, 'securite', title, message);
};

// Notification de rappel d'objectif
const createGoalReminderNotification = async (userId, goal) => {
  const title = 'Rappel d\'objectif';
  const message = `Votre objectif "${goal.title}" se termine dans ${goal.daysRemaining} jours. Progression: ${goal.currentAmount}/${goal.targetAmount} DT`;
  return createNotification(userId, 'rappel', title, message);
};

// Notification d'échec d'objectif
const createGoalFailedNotification = async (userId, goal) => {
  const title = 'Objectif non atteint';
  const message = `Votre objectif "${goal.title}" est arrivé à échéance. Vous avez atteint ${goal.currentAmount} DT sur ${goal.targetAmount} DT`;
  return createNotification(userId, 'objectif_echoue', title, message, null, null, goal._id);
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