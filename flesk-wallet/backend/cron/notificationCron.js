const cron = require('node-cron');
const savingGoalController = require('../controllers/savingGoalController');
const subscriptionController = require('../controllers/subscriptionController');

// Vérifier les objectifs expirés tous les jours à minuit
cron.schedule('0 0 * * *', async () => {
  console.log('=== Début de la vérification des objectifs d\'épargne ===');
  try {
    await savingGoalController.checkExpiredGoals();
    console.log('=== Fin de la vérification des objectifs d\'épargne ===');
  } catch (error) {
    console.error('Erreur lors de la vérification des objectifs:', error);
  }
});

// Vérifier les abonnements tous les jours à 8h
cron.schedule('0 8 * * *', async () => {
  console.log('=== Début de la vérification des abonnements ===');
  try {
    await subscriptionController.checkRenewalSubscriptions();
    console.log('=== Fin de la vérification des abonnements ===');
  } catch (error) {
    console.error('Erreur lors de la vérification des abonnements:', error);
  }
}); 