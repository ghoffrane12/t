const tf = require('@tensorflow/tfjs'); // Assure-toi que c'est tfjs (non-node)
const getMonthlyCategoryTotals = require('./dataPreparation');
const trainLSTMModel = require('./trainLSTMModel');

async function predictNextMonthExpenses(userId) {
  const dataByCategory = await getMonthlyCategoryTotals(userId);
  console.log("Données par catégorie:", dataByCategory);
  const predictions = {};

  if (Object.keys(dataByCategory).length === 0) {
    console.log("Aucune donnée trouvée pour les prédictions");
    return predictions;
  }

  for (const category of Object.keys(dataByCategory)) {
    const dataPoints = dataByCategory[category];
    const totals = dataPoints.map(dp => dp.total);

    if (totals.length < 5) {
      console.log(`❌ Pas assez de données pour ${category}`);
      predictions[category] = 0;
      continue;
    }

    // Entraînement du modèle
    const modelInfo = await trainLSTMModel(dataPoints);
    if (!modelInfo) {
      predictions[category] = 0;
      continue;
    }

    const { model, min, max } = modelInfo;

    // Dernière séquence pour prédire le mois suivant
    const sequenceLength = 3;
    const lastSequence = totals.slice(-sequenceLength).map(v => (v - min) / (max - min || 1));

    if (lastSequence.length < sequenceLength) {
      predictions[category] = 0;
      continue;
    }

    // ✅ Corrigé ici : transforme [0.1, 0.2, 0.3] en [[[0.1], [0.2], [0.3]]]
    const input = tf.tensor3d([lastSequence.map(v => [v])], [1, sequenceLength, 1]);

    const predNormalized = model.predict(input);
    const predValueNormalized = (await predNormalized.data())[0];

    // Dénormalisation
    const predValue = predValueNormalized * (max - min) + min;

    predictions[category] = Math.max(0, Math.round(predValue));
    console.log(`✅ Prédiction pour ${category}:`, predictions[category]);
  }

  return predictions;
}

module.exports = predictNextMonthExpenses;
