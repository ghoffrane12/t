const Subscription = require('../models/Subscription');
const Expense = require('../models/Expense');
const { createPaymentReminderNotification } = require('../services/notificationService');
const logger = require('../utils/logger');

// Créer un nouvel abonnement et sa première dépense
exports.createSubscription = async (req, res) => {
    try {
        logger.info('Création nouvel abonnement avec données:', req.body);

        // Validation des champs requis
        const { name, amount, category, frequency, startDate, description } = req.body;
        if (!name || !amount || !category || !frequency || !startDate || !description) {
            logger.warn('Champs requis manquants pour la création d\'abonnement');
            return res.status(400).json({
                message: "Tous les champs sont requis : name, amount, category, frequency, startDate, description"
            });
        }

        // Utiliser la date de début pour la première date de paiement pour la création de la dépense
        const initialNextPaymentDate = new Date(startDate);

        const subscription = new Subscription({
            ...req.body,
            user: req.user._id,
            nextPaymentDate: initialNextPaymentDate // Initialiser avec la date de début
        });
        await subscription.save();
        logger.info('Abonnement créé avec succès:', subscription._id);

        // Créer automatiquement la première dépense basée sur la date de début
        const expense = new Expense({
            nom: `${subscription.name} (Abonnement)`,
            description: `Paiement de l'abonnement ${subscription.name}`,
            amount: subscription.amount,
            category: subscription.category,
            date: initialNextPaymentDate,
            user: req.user._id
        });
        await expense.save();
        logger.info('Première dépense créée pour l\'abonnement:', expense._id);

        // Calculer la *prochaine* date de paiement (après la première)
        const nextDateAfterInitial = new Date(initialNextPaymentDate);
        if (subscription.frequency === 'monthly') {
            nextDateAfterInitial.setMonth(nextDateAfterInitial.getMonth() + 1);
        } else {
            nextDateAfterInitial.setFullYear(nextDateAfterInitial.getFullYear() + 1);
        }

        // Mettre à jour la prochaine date de paiement dans l'abonnement
        subscription.nextPaymentDate = nextDateAfterInitial;
        await subscription.save();
        logger.info('Date du prochain paiement mise à jour pour la prochaine échéance:', nextDateAfterInitial);

        // MAINTENANT, vérifier si une notification de rappel immédiate est nécessaire pour la *nouvelle* nextPaymentDate
        await createPaymentReminderNotification(subscription.user, subscription);

        res.status(201).json(subscription);
    } catch (error) {
        logger.error('Erreur lors de la création de l\'abonnement:', error);
        res.status(400).json({ 
            message: "Erreur lors de la création de l'abonnement",
            error: error.message 
        });
    }
};

// Obtenir tous les abonnements d'un utilisateur
exports.getSubscriptions = async (req, res) => {
    try {
        logger.info('Récupération des abonnements pour user:', req.user._id);
        const subscriptions = await Subscription.find({ user: req.user._id });
        logger.info(`${subscriptions.length} abonnements trouvés`);
        res.json(subscriptions);
    } catch (error) {
        logger.error('Erreur lors de la récupération des abonnements:', error);
        res.status(500).json({ 
            message: "Erreur lors de la récupération des abonnements",
            error: error.message 
        });
    }
};

// Obtenir un abonnement spécifique
exports.getSubscription = async (req, res) => {
    try {
        logger.info('Récupération abonnement:', req.params.id);
        const subscription = await Subscription.findOne({ 
            _id: req.params.id, 
            user: req.user._id 
        });
        
        if (!subscription) {
            logger.warn('Abonnement non trouvé:', req.params.id);
            return res.status(404).json({ message: "Abonnement non trouvé" });
        }
        
        logger.info('Abonnement trouvé:', subscription._id);
        res.json(subscription);
    } catch (error) {
        logger.error('Erreur lors de la récupération de l\'abonnement:', error);
        res.status(500).json({ 
            message: "Erreur lors de la récupération de l'abonnement",
            error: error.message 
        });
    }
};

// Mettre à jour un abonnement
exports.updateSubscription = async (req, res) => {
    try {
        logger.info('Mise à jour abonnement:', req.params.id, 'avec données:', req.body);
        
        const subscription = await Subscription.findOneAndUpdate(
            { _id: req.params.id, user: req.user._id },
            req.body,
            { new: true, runValidators: true }
        );

        if (!subscription) {
            logger.warn('Abonnement non trouvé pour mise à jour:', req.params.id);
            return res.status(404).json({ message: "Abonnement non trouvé" });
        }

        // Si l'abonnement est actif et la date de prochain paiement est passée, créer une nouvelle dépense
        if (subscription.isActive) {
            const today = new Date();
            today.setHours(0, 0, 0, 0);
            const nextPaymentDate = new Date(subscription.nextPaymentDate);
            nextPaymentDate.setHours(0, 0, 0, 0);

            if (nextPaymentDate <= today) {
                logger.info('Création nouvelle dépense pour abonnement:', subscription._id);
                
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
                logger.info('Nouvelle dépense créée:', expense._id);

                // Mettre à jour la prochaine date de paiement
                const nextDate = new Date(subscription.nextPaymentDate);
                if (subscription.frequency === 'monthly') {
                    nextDate.setMonth(nextDate.getMonth() + 1);
                } else {
                    nextDate.setFullYear(nextDate.getFullYear() + 1);
                }
                subscription.nextPaymentDate = nextDate;
                await subscription.save();
                logger.info('Date du prochain paiement mise à jour:', nextDate);
            }
        }
        
        // Vérifier si une notification de rappel immédiate est nécessaire après mise à jour
        await createPaymentReminderNotification(subscription.user, subscription);

        logger.info('Abonnement mis à jour avec succès:', subscription._id);
        res.json(subscription);
    } catch (error) {
        logger.error('Erreur lors de la mise à jour de l\'abonnement:', error);
        res.status(400).json({ 
            message: "Erreur lors de la mise à jour de l'abonnement",
            error: error.message 
        });
    }
};

// Supprimer un abonnement
exports.deleteSubscription = async (req, res) => {
    try {
        logger.info('Suppression abonnement:', req.params.id);
        const subscription = await Subscription.findOneAndDelete({ 
            _id: req.params.id, 
            user: req.user._id 
        });

        if (!subscription) {
            logger.warn('Abonnement non trouvé pour suppression:', req.params.id);
            return res.status(404).json({ message: "Abonnement non trouvé" });
        }

        logger.info('Abonnement supprimé avec succès:', subscription._id);
        res.json({ message: "Abonnement supprimé avec succès" });
    } catch (error) {
        logger.error('Erreur lors de la suppression de l\'abonnement:', error);
        res.status(500).json({ 
            message: "Erreur lors de la suppression de l'abonnement",
            error: error.message 
        });
    }
};

// Synchroniser les abonnements avec les dépenses
exports.syncSubscriptions = async (req, res) => {
    try {
        logger.info('Début synchronisation des abonnements');
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        // Trouver tous les abonnements actifs qui doivent être payés
        const subscriptions = await Subscription.find({
            user: req.user._id,
            isActive: true,
            nextPaymentDate: { $lte: today }
        });

        logger.info(`${subscriptions.length} abonnements à synchroniser trouvés`);
        const updatedSubscriptions = [];

        for (const subscription of subscriptions) {
            logger.info('Traitement abonnement:', subscription._id);
            
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
            logger.info('Nouvelle dépense créée:', expense._id);

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
            logger.info('Date du prochain paiement mise à jour:', nextDate);
            
            updatedSubscriptions.push(subscription);
        }

        logger.info('Synchronisation terminée avec succès');
        res.json({
            message: `${updatedSubscriptions.length} abonnement(s) synchronisé(s)`,
            updatedSubscriptions
        });
    } catch (error) {
        logger.error('Erreur lors de la synchronisation des abonnements:', error);
        res.status(500).json({ 
            message: "Erreur lors de la synchronisation des abonnements",
            error: error.message 
        });
    }
};

// Vérifier les abonnements à renouveler (à exécuter quotidiennement via un cron job)
exports.checkRenewalSubscriptions = async () => {
    try {
        logger.info('Début vérification des abonnements à renouveler');
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        const twoDaysFromNow = new Date(today);
        twoDaysFromNow.setDate(today.getDate() + 2);

        const threeDaysFromNow = new Date(twoDaysFromNow);
        threeDaysFromNow.setDate(twoDaysFromNow.getDate() + 1);

        // Rechercher les abonnements dont la prochaine date de paiement est dans 2 jours
        const subscriptionsToRenew = await Subscription.find({
            nextPaymentDate: {
                $gte: twoDaysFromNow,
                $lt: threeDaysFromNow
            },
            isActive: true
        });

        logger.info(`${subscriptionsToRenew.length} abonnements à renouveler dans 2 jours trouvés`);

        for (const subscription of subscriptionsToRenew) {
            logger.info('Création notification pour abonnement:', subscription._id);
            await createPaymentReminderNotification(subscription.user, subscription);
            logger.info('Notification créée avec succès');
        }

        logger.info('Vérification des abonnements terminée avec succès');
    } catch (error) {
        logger.error('Erreur lors de la vérification des abonnements à renouveler:', error);
        throw error;
    }
}; 