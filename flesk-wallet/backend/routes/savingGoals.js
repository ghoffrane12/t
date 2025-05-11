const express = require('express');
const router = express.Router();
const savingGoalController = require('../controllers/savingGoalController');
const { protect } = require('../middleware/auth');

// Appliquer le middleware d'authentification à toutes les routes
router.use(protect);

// Obtenir tous les objectifs d'épargne
router.get('/', savingGoalController.getAllSavingGoals);

// Créer un nouvel objectif d'épargne
router.post('/', savingGoalController.createSavingGoal);

// Mettre à jour un objectif d'épargne
router.put('/:id', savingGoalController.updateSavingGoal);

// Supprimer un objectif d'épargne
router.delete('/:id', savingGoalController.deleteSavingGoal);

module.exports = router; 