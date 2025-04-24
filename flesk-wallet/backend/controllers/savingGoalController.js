const SavingGoal = require('../models/SavingGoal');

// Obtenir tous les objectifs d'un utilisateur
exports.getAllSavingGoals = async (req, res) => {
  try {
    const goals = await SavingGoal.find({ userId: req.user._id });
    // Mettre à jour le statut de chaque objectif
    for (let goal of goals) {
      goal.checkStatus();
      await goal.save();
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
    const goal = new SavingGoal({
      ...req.body,
      userId: req.user._id,
      currentAmount: 0
    });
    const savedGoal = await goal.save();
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
    const goal = await SavingGoal.findOne({
      _id: req.params.id,
      userId: req.user._id
    });

    if (!goal) {
      return res.status(404).json({ message: "Objectif d'épargne non trouvé" });
    }

    Object.assign(goal, req.body);
    goal.checkStatus();
    const updatedGoal = await goal.save();
    res.json(updatedGoal);
  } catch (err) {
    console.error('Erreur lors de la mise à jour de l\'objectif:', err);
    res.status(400).json({ 
      message: "Erreur lors de la mise à jour de l'objectif d'épargne",
      error: err.message 
    });
  }
};

// Supprimer un objectif
exports.deleteSavingGoal = async (req, res) => {
  try {
    const goal = await SavingGoal.findOneAndDelete({
      _id: req.params.id,
      userId: req.user._id
    });

    if (!goal) {
      return res.status(404).json({ message: "Objectif d'épargne non trouvé" });
    }

    res.json({ message: "Objectif d'épargne supprimé" });
  } catch (err) {
    console.error('Erreur lors de la suppression de l\'objectif:', err);
    res.status(500).json({ 
      message: "Erreur lors de la suppression de l'objectif d'épargne",
      error: err.message 
    });
  }
}; 