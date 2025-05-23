const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth');
const predictNextMonthExpenses = require('../utils/predictNextMonth');

router.get('/next-month', protect, async (req, res) => {
  try {
    const predictions = await predictNextMonthExpenses(req.user.id);
    res.json({ success: true, predictions });
    console.log("Lancement de la prédiction pour l'utilisateur :", req.user.id);

  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: 'Erreur de prédiction' });
  }
});

module.exports = router;
