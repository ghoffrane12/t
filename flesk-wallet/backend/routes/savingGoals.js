const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth');
const SavingsGoal = require('../models/SavingsGoal');

// Appliquer le middleware d'authentification à toutes les routes
router.use(protect);

// Obtenir tous les objectifs d'épargne
router.get('/', async (req, res) => {
  try {
    const savingGoals = await SavingsGoal.find({ userId: req.user.id }).sort({ createdAt: -1 });
    res.json(savingGoals);
  } catch (error) {
    console.error('Erreur lors de la récupération des objectifs d\'épargne:', error);
    res.status(500).json({ message: 'Erreur lors de la récupération des objectifs d\'épargne' });
  }
});

// Créer un nouvel objectif d'épargne
router.post('/', async (req, res) => {
  try {
    const { title, targetAmount, currentAmount, deadline, category } = req.body;
    const newGoal = new SavingsGoal({
      userId: req.user.id,
      title,
      targetAmount,
      currentAmount: currentAmount || 0,
      deadline,
      category
    });
    await newGoal.save();
    res.status(201).json(newGoal);
  } catch (error) {
    console.error('Erreur lors de la création de l\'objectif d\'épargne:', error);
    res.status(500).json({ message: 'Erreur lors de la création de l\'objectif d\'épargne' });
  }
});

// Mettre à jour un objectif d'épargne
router.put('/:id', async (req, res) => {
  try {
    const goal = await SavingsGoal.findOneAndUpdate(
      { _id: req.params.id, userId: req.user.id },
      { $set: req.body },
      { new: true }
    );
    if (!goal) {
      return res.status(404).json({ message: 'Objectif d\'épargne non trouvé' });
    }
    res.json(goal);
  } catch (error) {
    console.error('Erreur lors de la mise à jour de l\'objectif d\'épargne:', error);
    res.status(500).json({ message: 'Erreur lors de la mise à jour de l\'objectif d\'épargne' });
  }
});

// Supprimer un objectif d'épargne
router.delete('/:id', async (req, res) => {
  try {
    const goal = await SavingsGoal.findOneAndDelete({ _id: req.params.id, userId: req.user.id });
    if (!goal) {
      return res.status(404).json({ message: 'Objectif d\'épargne non trouvé' });
    }
    res.json({ message: 'Objectif d\'épargne supprimé avec succès' });
  } catch (error) {
    console.error('Erreur lors de la suppression de l\'objectif d\'épargne:', error);
    res.status(500).json({ message: 'Erreur lors de la suppression de l\'objectif d\'épargne' });
  }
});

module.exports = router; 