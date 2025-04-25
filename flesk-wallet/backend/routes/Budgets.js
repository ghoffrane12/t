const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth');
const {
  getBudgets,
  createBudget,
  updateBudget,
  deleteBudget,
  getBudgetStats,
  deductFromBudget
} = require('../controllers/budgetController');

// Protection de toutes les routes
router.use(protect);

// Routes pour les budgets
router.route('/')
  .get(getBudgets)
  .post(createBudget);

router.get('/stats', getBudgetStats);
router.put('/:id', updateBudget);
router.put('/:id/deduct', deductFromBudget);
router.delete('/:id', deleteBudget);

module.exports = router;
