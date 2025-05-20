const Subscription = require('../models/Subscription');
const Expense = require('../models/Expense');
const { createPaymentReminderNotification } = require('../services/notificationService');

// Créer un nouvel abonnement et sa première dépense
exports.createSubscription = async (req, res) => {
    try {
        const subscription = new Subscription({
            ...req.body,
            user: req.user._id,
            nextPaymentDate: req.body.startDate // Initialement, la prochaine date de paiement est la date de début
        });
        await subscription.save();

        // Créer automatiquement la première dépense
        const expense = new Expense({
            nom: `${subscription.name} (Abonnement)`,
            description: `Paiement de l'abonnement ${subscription.name}`,
            amount: subscription.amount,
            category: subscription.category,
            date: subscription.startDate,
            user: req.user._id
        });
        await expense.save();

        // Calculer et mettre à jour la prochaine date de paiement
        const nextDate = new Date(subscription.startDate);
        if (subscription.frequency === 'monthly') {
            nextDate.setMonth(nextDate.getMonth() + 1);
        } else {
            nextDate.setFullYear(nextDate.getFullYear() + 1);
        }
        subscription.nextPaymentDate = nextDate;
        await subscription.save();

        res.status(201).json(subscription);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// Obtenir tous les abonnements d'un utilisateur
exports.getSubscriptions = async (req, res) => {
    try {
        const subscriptions = await Subscription.find({ user: req.user._id });
        res.json(subscriptions);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Obtenir un abonnement spécifique
exports.getSubscription = async (req, res) => {
    try {
        const subscription = await Subscription.findOne({ _id: req.params.id, user: req.user._id });
        if (!subscription) {
            return res.status(404).json({ message: "Abonnement non trouvé" });
        }
        res.json(subscription);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Mettre à jour un abonnement
exports.updateSubscription = async (req, res) => {
    try {
        const subscription = await Subscription.findOneAndUpdate(
            { _id: req.params.id, user: req.user._id },
            req.body,
            { new: true, runValidators: true }
        );
        if (!subscription) {
            return res.status(404).json({ message: "Abonnement non trouvé" });
        }

        // Si l'abonnement est actif et la date de prochain paiement est passée, créer une nouvelle dépense
        if (subscription.isActive) {
            const today = new Date();
            today.setHours(0, 0, 0, 0);
            const nextPaymentDate = new Date(subscription.nextPaymentDate);
            nextPaymentDate.setHours(0, 0, 0, 0);

            if (nextPaymentDate <= today) {
                // Créer la dépense
                const expense = new Expense({
                    nom: `${subscription.name} (Abonnement)`,
                    description: `Paiement de l'abonnement ${subscription.name}`,
                    amount: subscription.amount,
                    category: subscription.category,
                    date: subscription.nextPaymentDate,
                    user: req.user._id
                });
                await expense.save();

                // Mettre à jour la prochaine date de paiement
                const nextDate = new Date(subscription.nextPaymentDate);
                if (subscription.frequency === 'monthly') {
                    nextDate.setMonth(nextDate.getMonth() + 1);
                } else {
                    nextDate.setFullYear(nextDate.getFullYear() + 1);
                }
                subscription.nextPaymentDate = nextDate;
                await subscription.save();
            }
        }

        res.json(subscription);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// Supprimer un abonnement
exports.deleteSubscription = async (req, res) => {
    try {
        const subscription = await Subscription.findOneAndDelete({ _id: req.params.id, user: req.user._id });
        if (!subscription) {
            return res.status(404).json({ message: "Abonnement non trouvé" });
        }
        res.json({ message: "Abonnement supprimé avec succès" });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Synchroniser les abonnements avec les dépenses
exports.syncSubscriptions = async (req, res) => {
    try {
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        // Trouver tous les abonnements actifs qui doivent être payés
        const subscriptions = await Subscription.find({
            user: req.user._id,
            isActive: true,
            nextPaymentDate: { $lte: today }
        });

        const updatedSubscriptions = [];

        for (const subscription of subscriptions) {
            // Créer une nouvelle dépense pour cet abonnement
            const expense = new Expense({
                nom: `${subscription.name} (Abonnement)`,
                description: `Paiement de l'abonnement ${subscription.name}`,
                amount: subscription.amount,
                category: subscription.category,
                date: subscription.nextPaymentDate,
                user: req.user._id
            });
            await expense.save();

            // Calculer la prochaine date de paiement
            const nextDate = new Date(subscription.nextPaymentDate);
            if (subscription.frequency === 'monthly') {
                nextDate.setMonth(nextDate.getMonth() + 1);
            } else {
                nextDate.setFullYear(nextDate.getFullYear() + 1);
            }

            // Mettre à jour la date du prochain paiement
            subscription.nextPaymentDate = nextDate;
            await subscription.save();
            updatedSubscriptions.push(subscription);
        }

        res.json({
            message: `${updatedSubscriptions.length} abonnement(s) synchronisé(s)`,
            updatedSubscriptions
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Vérifier les abonnements à renouveler (à exécuter quotidiennement via un cron job)
exports.checkRenewalSubscriptions = async () => {
    try {
        const today = new Date();
        today.setHours(0, 0, 0, 0); // Début d'aujourd'hui

        const tomorrow = new Date(today);
        tomorrow.setDate(today.getDate() + 1); // Début de demain

        const dayAfterTomorrow = new Date(tomorrow);
        dayAfterTomorrow.setDate(tomorrow.getDate() + 1); // Début d'après-demain

        // Rechercher les abonnements dont la prochaine date de paiement est exactement demain
        const subscriptionsToRenew = await Subscription.find({
            nextPaymentDate: {
                $gte: tomorrow, // Date égale ou supérieure au début de demain
                $lt: dayAfterTomorrow // Date strictement inférieure au début d'après-demain
            }
        });

        for (const subscription of subscriptionsToRenew) {
            // Créer une notification de rappel de paiement pour demain
            await createPaymentReminderNotification(subscription.user, subscription);
        }
    } catch (error) {
        console.error('Erreur lors de la vérification des abonnements à renouveler:', error);
    }
}; 