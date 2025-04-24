const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const SavingsGoal = require('../models/SavingsGoal');

// Protection de toutes les routes
router.use(auth);

// Obtenir tous les objectifs d'épargne
router.get('/', async (req, res) => {
  try {
    const goals = await SavingsGoal.find({ userId: req.user.id })
      .sort({ deadline: 1 });
    res.json(goals);
  } catch (error) {
    console.error('Erreur lors de la récupération des objectifs:', error);
    res.status(500).json({ message: 'Erreur lors de la récupération des objectifs d\'épargne' });
  }
});

// Créer un nouvel objectif d'épargne
router.post('/', async (req, res) => {
  try {
    const { title, targetAmount, currentAmount, deadline, category } = req.body;

    const goal = new SavingsGoal({
      userId: req.user.id,
      title,
      targetAmount,
      currentAmount,
      deadline,
      category
    });

    await goal.save();
    res.status(201).json(goal);
  } catch (error) {
    console.error('Erreur lors de la création de l\'objectif:', error);
    res.status(500).json({ message: 'Erreur lors de la création de l\'objectif d\'épargne' });
  }
});

// Mettre à jour un objectif d'épargne
router.put('/:id', async (req, res) => {
  try {
    const goal = await SavingsGoal.findOneAndUpdate(
      { _id: req.params.id, userId: req.user.id },
      req.body,
      { new: true }
    );

    if (!goal) {
      return res.status(404).json({ message: 'Objectif d\'épargne non trouvé' });
    }

    res.json(goal);
  } catch (error) {
    console.error('Erreur lors de la mise à jour de l\'objectif:', error);
    res.status(500).json({ message: 'Erreur lors de la mise à jour de l\'objectif d\'épargne' });
  }
});

// Supprimer un objectif d'épargne
router.delete('/:id', async (req, res) => {
  try {
    const goal = await SavingsGoal.findOneAndDelete({
      _id: req.params.id,
      userId: req.user.id
    });

    if (!goal) {
      return res.status(404).json({ message: 'Objectif d\'épargne non trouvé' });
    }

    res.json({ message: 'Objectif d\'épargne supprimé avec succès' });
  } catch (error) {
    console.error('Erreur lors de la suppression de l\'objectif:', error);
    res.status(500).json({ message: 'Erreur lors de la suppression de l\'objectif d\'épargne' });
  }
});

module.exports = router; 