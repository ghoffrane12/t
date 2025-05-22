const SavingsGoal = require('../models/SavingsGoal');
const { createGoalAchievedNotification, createGoalReminderNotification, createGoalFailedNotification } = require('../services/notificationService');
const logger = require('../utils/logger');

// Fonction utilitaire pour vérifier et créer les notifications
const checkAndCreateNotifications = async (goal, userId) => {
  // Notification si objectif atteint
  if (goal.currentAmount >= goal.targetAmount) {
    logger.info('Objectif atteint, création notification');
    await createGoalAchievedNotification(userId, goal);
  }

  // Notification de rappel si l'objectif se termine dans moins de 7 jours
  const daysRemaining = Math.ceil((new Date(goal.deadline) - new Date()) / (1000 * 60 * 60 * 24));
  if (daysRemaining <= 7 && daysRemaining > 0) {
    logger.info('Rappel objectif, jours restants:', daysRemaining);
    await createGoalReminderNotification(userId, {
      ...goal.toObject(),
      daysRemaining
    });
  }

  // Notification si l'objectif est échoué
  if (new Date() > new Date(goal.deadline) && goal.currentAmount < goal.targetAmount) {
    logger.info('Objectif échoué, création notification');
    await createGoalFailedNotification(userId, goal);
  }
};

// Obtenir tous les objectifs d'un utilisateur
exports.getAllSavingGoals = async (req, res) => {
  try {
    logger.info('Récupération des objectifs pour user:', req.user._id);
    const goals = await SavingsGoal.find({ user: req.user._id });
    logger.info(`${goals.length} objectifs trouvés`);
    
    // La vérification du statut et la création des notifications sont gérées par le cron job et d'autres routes spécifiques (sync/update).
    // Nous ne les exécutons pas lors d'une simple récupération pour éviter les appels multiples.
    
    res.json(goals);
  } catch (err) {
    logger.error('Erreur lors de la récupération des objectifs:', err);
    res.status(500).json({ 
      message: "Erreur lors de la récupération des objectifs d'épargne",
      error: err.message 
    });
  }
};

// Créer un nouvel objectif
exports.createSavingGoal = async (req, res) => {
  try {
    logger.info('Création nouvel objectif avec données:', req.body);
    
    // Validation des champs requis
    const { title, category, targetAmount, deadline } = req.body;
    if (!title || !category || !targetAmount || !deadline) {
      return res.status(400).json({
        message: "Tous les champs sont requis : title, category, targetAmount, deadline"
      });
    }

    const goal = new SavingsGoal({
      ...req.body,
      user: req.user._id,
      currentAmount: req.body.currentAmount || 0
    });
    
    const savedGoal = await goal.save();
    logger.info('Objectif créé avec succès:', savedGoal._id);
    
    // Vérifier toutes les notifications possibles
    await checkAndCreateNotifications(savedGoal, req.user._id);
    
    res.status(201).json(savedGoal);
  } catch (err) {
    logger.error('Erreur lors de la création de l\'objectif:', err);
    res.status(400).json({ 
      message: "Erreur lors de la création de l'objectif d'épargne",
      error: err.message 
    });
  }
};

// Ajouter une contribution à un objectif
exports.addContribution = async (req, res) => {
  try {
    const { goalId } = req.params;
    const { amount, description } = req.body;

    if (!amount || amount <= 0) {
      return res.status(400).json({ message: 'Le montant doit être positif' });
    }

    const goal = await SavingsGoal.findOne({
      _id: goalId,
      user: req.user._id
    });

    if (!goal) {
      return res.status(404).json({ message: "Objectif d'épargne non trouvé" });
    }

    goal.currentAmount += amount;
    goal.checkStatus();
    await goal.save();

    // Vérifier les notifications après l'ajout de la contribution
    await checkAndCreateNotifications(goal, req.user._id);

    logger.info(`Contribution de ${amount} ajoutée à l'objectif ${goalId}`);
    res.json(goal);
  } catch (err) {
    logger.error('Erreur lors de l\'ajout de la contribution:', err);
    res.status(400).json({ 
      message: "Erreur lors de l'ajout de la contribution",
      error: err.message 
    });
  }
};

// Mettre à jour un objectif
exports.updateSavingGoal = async (req, res) => {
  try {
    logger.info('Mise à jour objectif:', req.params.id, 'avec données:', req.body);
    
    const goal = await SavingsGoal.findOne({
      _id: req.params.id,
      user: req.user._id
    });

    if (!goal) {
      logger.warn('Objectif non trouvé');
      return res.status(404).json({ message: "Objectif d'épargne non trouvé" });
    }

    Object.assign(goal, req.body);
    goal.checkStatus();

    // Vérifier toutes les notifications possibles
    await checkAndCreateNotifications(goal, req.user._id);

    const updatedGoal = await goal.save();
    logger.info('Objectif mis à jour avec succès');
    res.json(updatedGoal);
  } catch (err) {
    logger.error('Erreur lors de la mise à jour de l\'objectif:', err);
    res.status(400).json({ 
      message: "Erreur lors de la mise à jour de l'objectif d'épargne",
      error: err.message 
    });
  }
};

// Vérifier les objectifs expirés (appelé par le cron)
exports.checkExpiredGoals = async () => {
  try {
    logger.info('Vérification des objectifs expirés...');
    const expiredGoals = await SavingsGoal.find({
      deadline: { $lt: new Date() },
      status: { $ne: 'COMPLETED' }
    });

    logger.info(`${expiredGoals.length} objectifs expirés trouvés`);
    
    for (const goal of expiredGoals) {
      goal.status = 'FAILED';
      await goal.save();
      
      // Créer notification d'échec
      await createGoalFailedNotification(goal.user, goal);
      logger.info('Notification d\'échec créée pour objectif:', goal._id);
    }
  } catch (err) {
    logger.error('Erreur lors de la vérification des objectifs expirés:', err);
  }
};

// Vérifier les objectifs en retard (route admin)
exports.checkBehindGoals = async (req, res) => {
  try {
    await exports.checkExpiredGoals();
    res.json({ message: 'Vérification des objectifs terminée' });
  } catch (err) {
    logger.error('Erreur lors de la vérification des objectifs:', err);
    res.status(500).json({ message: err.message });
  }
};

// Supprimer un objectif
exports.deleteSavingGoal = async (req, res) => {
  try {
    logger.info('Suppression objectif:', req.params.id);
    const goal = await SavingsGoal.findOneAndDelete({
      _id: req.params.id,
      user: req.user._id
    });

    if (!goal) {
      logger.warn('Objectif non trouvé pour suppression');
      return res.status(404).json({ message: "Objectif d'épargne non trouvé" });
    }

    logger.info('Objectif supprimé avec succès');
    res.json({ message: "Objectif d'épargne supprimé" });
  } catch (err) {
    logger.error('Erreur lors de la suppression de l\'objectif:', err);
    res.status(500).json({ 
      message: "Erreur lors de la suppression de l'objectif d'épargne",
      error: err.message 
    });
  }
};

