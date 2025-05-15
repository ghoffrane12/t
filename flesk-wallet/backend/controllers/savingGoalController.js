const SavingsGoal = require('../models/SavingsGoal');
const { createGoalAchievedNotification, createGoalReminderNotification, createGoalFailedNotification } = require('../services/notificationService');

// Fonction utilitaire pour vérifier et créer les notifications
const checkAndCreateNotifications = async (goal, userId) => {
  // Notification si objectif atteint
  if (goal.currentAmount >= goal.targetAmount) {
    console.log('Objectif atteint, création notification');
    await createGoalAchievedNotification(userId, goal);
  }

  // Notification de rappel si l'objectif se termine dans moins de 7 jours
  const daysRemaining = Math.ceil((new Date(goal.deadline) - new Date()) / (1000 * 60 * 60 * 24));
  if (daysRemaining <= 7 && daysRemaining > 0) {
    console.log('Rappel objectif, jours restants:', daysRemaining);
    await createGoalReminderNotification(userId, {
      ...goal.toObject(),
      daysRemaining
    });
  }

  // Notification si l'objectif est échoué
  if (new Date() > new Date(goal.deadline) && goal.currentAmount < goal.targetAmount) {
    console.log('Objectif échoué, création notification');
    await createGoalFailedNotification(userId, goal);
  }
};

// Obtenir tous les objectifs d'un utilisateur
exports.getAllSavingGoals = async (req, res) => {
  try {
    console.log('Récupération des objectifs pour user:', req.user._id);
    const goals = await SavingsGoal.find({ userId: req.user._id });
    console.log(`${goals.length} objectifs trouvés`);
    
    // Mettre à jour le statut de chaque objectif et vérifier les notifications
    for (let goal of goals) {
      goal.checkStatus();
      await goal.save();
      await checkAndCreateNotifications(goal, req.user._id);
    }
    res.json(goals);
  } catch (err) {
    console.error('Erreur lors de la récupération des objectifs:', err);
    res.status(500).json({ 
      message: "Erreur lors de la récupération des objectifs d'épargne",
      error: err.message 
    });
  }
};

// Créer un nouvel objectif
exports.createSavingGoal = async (req, res) => {
  try {
    console.log('Création nouvel objectif avec données:', req.body);
    const goal = new SavingsGoal({
      ...req.body,
      userId: req.user._id,
      currentAmount: req.body.currentAmount || 0
    });
    
    const savedGoal = await goal.save();
    console.log('Objectif créé avec succès:', savedGoal._id);
    
    // Vérifier toutes les notifications possibles
    await checkAndCreateNotifications(savedGoal, req.user._id);
    
    res.status(201).json(savedGoal);
  } catch (err) {
    console.error('Erreur lors de la création de l\'objectif:', err);
    res.status(400).json({ 
      message: "Erreur lors de la création de l'objectif d'épargne",
      error: err.message 
    });
  }
};

// Mettre à jour un objectif
exports.updateSavingGoal = async (req, res) => {
  try {
    console.log('Mise à jour objectif:', req.params.id, 'avec données:', req.body);
    
    const goal = await SavingsGoal.findOne({
      _id: req.params.id,
      userId: req.user._id
    });

    if (!goal) {
      console.log('Objectif non trouvé');
      return res.status(404).json({ message: "Objectif d'épargne non trouvé" });
    }

    Object.assign(goal, req.body);
    goal.checkStatus();

    // Vérifier toutes les notifications possibles
    await checkAndCreateNotifications(goal, req.user._id);

    const updatedGoal = await goal.save();
    console.log('Objectif mis à jour avec succès');
    res.json(updatedGoal);
  } catch (err) {
    console.error('Erreur lors de la mise à jour de l\'objectif:', err);
    res.status(400).json({ 
      message: "Erreur lors de la mise à jour de l'objectif d'épargne",
      error: err.message 
    });
  }
};

// Vérifier les objectifs expirés (appelé par le cron)
exports.checkExpiredGoals = async () => {
  try {
    console.log('Vérification des objectifs expirés...');
    const expiredGoals = await SavingsGoal.find({
      deadline: { $lt: new Date() },
      status: { $ne: 'COMPLETED' }
    });

    console.log(`${expiredGoals.length} objectifs expirés trouvés`);
    
    for (const goal of expiredGoals) {
      goal.status = 'FAILED';
      await goal.save();
      
      // Créer notification d'échec
      await createGoalFailedNotification(goal.userId, goal);
      console.log('Notification d\'échec créée pour objectif:', goal._id);
    }
  } catch (err) {
    console.error('Erreur lors de la vérification des objectifs expirés:', err);
  }
};

// Supprimer un objectif
exports.deleteSavingGoal = async (req, res) => {
  try {
    console.log('Suppression objectif:', req.params.id);
    const goal = await SavingsGoal.findOneAndDelete({
      _id: req.params.id,
      userId: req.user._id
    });

    if (!goal) {
      console.log('Objectif non trouvé pour suppression');
      return res.status(404).json({ message: "Objectif d'épargne non trouvé" });
    }

    console.log('Objectif supprimé avec succès');
    res.json({ message: "Objectif d'épargne supprimé" });
  } catch (err) {
    console.error('Erreur lors de la suppression de l\'objectif:', err);
    res.status(500).json({ 
      message: "Erreur lors de la suppression de l'objectif d'épargne",
      error: err.message 
    });
  }
}; 