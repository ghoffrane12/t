const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth');
const generateExpenses = require('../scripts/expensesByUser');

router.post('/generate-expenses', protect, async (req, res) => {
  try {
    await generateExpenses(req.user.id);
    res.json({ success: true, message: 'Dépenses générées ✅' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: 'Erreur lors de la génération' });
  }
});

module.exports = router;
