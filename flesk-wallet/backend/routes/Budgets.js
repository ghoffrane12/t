const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth');
const {
  getBudgets,
  createBudget,
  updateBudget,
  deleteBudget,
  getBudgetStats
} = require('../controllers/budgetController');

// Protection de toutes les routes
router.use(protect);

// Routes pour les budgets
router.get('/', getBudgets);
router.post('/', protect, async (req, res, next) => {
  console.log('Route budget appelée');
  console.log('User dans la requête:', req.user);
  next();
}, createBudget);
router.put('/:id', updateBudget);
router.delete('/:id', deleteBudget);
router.get('/stats', getBudgetStats);

module.exports = router;
