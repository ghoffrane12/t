const tf = require('@tensorflow/tfjs');

async function trainModelForCategory(dataPoints) {
  if (dataPoints.length < 2) return null;

  // Transformer les mois en index numériques
  const xs = tf.tensor1d(dataPoints.map((_, i) => i));
  const rawYs = dataPoints.map(p => p.total);

  // ⚙️ Normalisation Min-Max
  const min = Math.min(...rawYs);
  const max = Math.max(...rawYs);
  const ysNormalized = rawYs.map(v => (v - min) / (max - min || 1)); // éviter division par zéro

  const ys = tf.tensor1d(ysNormalized);

  // Modèle simple
  const model = tf.sequential();
  model.add(tf.layers.dense({ units: 1, inputShape: [1] }));
  model.compile({ loss: 'meanSquaredError', optimizer: 'sgd' });

  await model.fit(xs, ys, { epochs: 200, verbose: 0 });

  // Retourner aussi min/max pour la dénormalisation
  return { model, min, max };
}

module.exports = trainModelForCategory;
