const express = require('express');
const router = express.Router();
const tf = require('@tensorflow/tfjs');

// Exemple de prédiction (à remplacer par ta logique)
router.get('/predict', async (req, res) => {
  try {
    // Exemple de données d'entrée pour la prédiction
    const features = [500, 10]; // Exemple: montant de 500 et catégorie de longueur 10
    
    // Créer un modèle simple (tu peux le remplacer par ton modèle préexistant)
    const model = tf.sequential();
    model.add(tf.layers.dense({ units: 64, activation: 'relu', inputShape: [2] }));
    model.add(tf.layers.dense({ units: 32, activation: 'relu' }));
    model.add(tf.layers.dense({ units: 1 }));

    // Charger un modèle déjà existant si tu en as un sauvegardé
    // await model.loadLayersModel('path_to_model/model.json');

    // Conversion des données d'entrée en tensors
    const input = tf.tensor2d([features]);

    // Prédiction
    const prediction = model.predict(input);
    const result = await prediction.data(); // Pour récupérer la prédiction

    res.json({ prediction: result[0] });  // Envoie la prédiction en réponse
  } catch (error) {
    console.error('Erreur de prédiction:', error);
    res.status(500).json({ error: 'Erreur interne du serveur' });
  }
});

module.exports = router;
