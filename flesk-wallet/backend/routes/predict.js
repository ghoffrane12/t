const express = require('express');
const fetch = require('node-fetch');
const { protect } = require('../middleware/auth'); // <- Déstructure pour prendre la bonne fonction

const router = express.Router();

router.get('/', protect, async (req, res) => {
  try {
    const userId = req.user._id; // ou req.user.id selon le modèle

    const response = await fetch(`http://localhost:5001/predict/${userId}`);
    const data = await response.json();

    res.status(response.status).json(data);
  } catch (error) {
    console.error('Erreur lors de la prédiction :', error);
    res.status(500).json({ error: 'Erreur lors de la prédiction.' });
  }
});

module.exports = router;
