import { Subscription } from './subscriptionsService';
import { createExpense } from './expensesService';

export const syncSubscriptionToExpense = async (subscription: Subscription) => {
  try {
    // Créer une dépense à partir de l'abonnement
    await createExpense({
      nom: `${subscription.name} (Abonnement)`,
      description: `Paiement de l'abonnement ${subscription.name}`,
      amount: subscription.amount,
      category: subscription.category,
      date: subscription.nextPaymentDate
    });

    // Mettre à jour la date du prochain paiement
    const nextDate = new Date(subscription.nextPaymentDate);
    if (subscription.frequency === 'monthly') {
      nextDate.setMonth(nextDate.getMonth() + 1);
    } else {
      nextDate.setFullYear(nextDate.getFullYear() + 1);
    }

    return nextDate.toISOString();
  } catch (error) {
    console.error('Erreur lors de la synchronisation de l\'abonnement:', error);
    throw error;
  }
};

export const checkAndSyncSubscriptions = async (subscriptions: Subscription[]) => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const updatedSubscriptions: Subscription[] = [];

  for (const subscription of subscriptions) {
    if (!subscription.isActive) continue;

    const nextPaymentDate = new Date(subscription.nextPaymentDate);
    nextPaymentDate.setHours(0, 0, 0, 0);

    if (nextPaymentDate <= today) {
      try {
        const newNextPaymentDate = await syncSubscriptionToExpense(subscription);
        updatedSubscriptions.push({
          ...subscription,
          nextPaymentDate: newNextPaymentDate
        });
      } catch (error) {
        console.error(`Erreur lors de la synchronisation de l'abonnement ${subscription._id}:`, error);
      }
    }
  }

  return updatedSubscriptions;
}; 