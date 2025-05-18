const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth');
const SavingsGoal = require('../models/SavingsGoal');

// Protection de toutes les routes
router.use(protect);

// Obtenir tous les objectifs d'épargne
router.get('/', async (req, res) => {
  try {
    console.log('GET /savings - User ID:', req.user.id);
    const goals = await SavingsGoal.find({ user: req.user.id });
    console.log('Goals found:', goals);
    res.json(goals);
  } catch (err) {
    console.error('Error in GET /savings:', err);
    res.status(500).json({ message: 'Erreur lors de la récupération des objectifs' });
  }
});

// Créer un nouvel objectif d'épargne
router.post('/', async (req, res) => {
  try {
    console.log('POST /savings - Request body:', req.body);
    console.log('POST /savings - User ID:', req.user.id);
    
    const { title, category, targetAmount, currentAmount, deadline } = req.body;
    const goal = new SavingsGoal({
      user: req.user.id,
      title,
      category,
      targetAmount,
      currentAmount,
      deadline
    });
    
    console.log('Creating new goal:', goal);
    await goal.save();
    console.log('Goal saved successfully');
    
    res.status(201).json(goal);
  } catch (err) {
    console.error('Error in POST /savings:', err);
    res.status(500).json({ message: 'Erreur lors de la création de l\'objectif' });
  }
});

// Mettre à jour un objectif d'épargne
router.put('/:id', async (req, res) => {
  try {
    const goal = await SavingsGoal.findOneAndUpdate(
      { _id: req.params.id, user: req.user.id },
      req.body,
      { new: true }
    );
    if (!goal) {
      return res.status(404).json({ message: 'Objectif non trouvé' });
    }
    res.json(goal);
  } catch (err) {
    res.status(500).json({ message: 'Erreur lors de la mise à jour de l\'objectif' });
  }
});

// Supprimer un objectif d'épargne
router.delete('/:id', async (req, res) => {
  try {
    const goal = await SavingsGoal.findOneAndDelete({
      _id: req.params.id,
      user: req.user.id
    });
    if (!goal) {
      return res.status(404).json({ message: 'Objectif non trouvé' });
    }
    res.json({ message: 'Objectif supprimé avec succès' });
  } catch (err) {
    res.status(500).json({ message: 'Erreur lors de la suppression de l\'objectif' });
  }
});

module.exports = router; 