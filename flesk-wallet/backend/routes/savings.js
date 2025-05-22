const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth');
const {
  getAllSavingGoals,
  createSavingGoal,
  updateSavingGoal,
  deleteSavingGoal,
  addContribution,
  checkBehindGoals
} = require('../controllers/savingGoalController');

// Protection de toutes les routes
router.use(protect);

// Routes pour les objectifs d'épargne
router.route('/')
  .get(getAllSavingGoals)
  .post(createSavingGoal);

router.route('/:id')
  .put(updateSavingGoal)
  .delete(deleteSavingGoal);

// Route pour ajouter une contribution
router.post('/:goalId/contributions', addContribution);

// Route admin pour vérifier les objectifs en retard
router.post('/check-behind', checkBehindGoals);

module.exports = router; 