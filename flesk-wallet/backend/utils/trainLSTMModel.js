const tf = require('@tensorflow/tfjs');

// Crée des séquences glissantes à partir de la série temporelle
function createSequences(data, sequenceLength = 3) {
  const inputs = [];
  const targets = [];
  for (let i = 0; i < data.length - sequenceLength; i++) {
    const seq = data.slice(i, i + sequenceLength);
    const target = data[i + sequenceLength];
    if (seq.length === sequenceLength && typeof target === 'number') {
      inputs.push(seq);
      targets.push(target);
    }
  }
  return { inputs, targets };
}

async function trainLSTMModel(dataPoints) {
  if (dataPoints.length < 5) {
    return null; // Trop peu de données pour entraîner
  }

  // Étape 1 : Extraire les totaux et normaliser
  const totals = dataPoints.map(dp => dp.total);
  const min = Math.min(...totals);
  const max = Math.max(...totals);
  const normalized = totals.map(v => (v - min) / (max - min || 1));

  // Étape 2 : Créer des séquences
  const sequenceLength = 3;
  const { inputs, targets } = createSequences(normalized, sequenceLength);

  if (inputs.length === 0 || targets.length === 0) {
    console.log("⚠️ Pas assez de séquences valides");
    return null;
  }

  const cleanInputs = inputs.map(seq => seq.map(Number)); // nettoyage
  console.log("✅ Séquences générées:", cleanInputs);
  console.log("Séquence nettoyée (exemple):", JSON.stringify(cleanInputs.slice(0, 2), null, 2));

  const xs = tf.tensor3d(
    cleanInputs.map(s => s.map(v => [v])),
    [cleanInputs.length, sequenceLength, 1]
  );
  const ys = tf.tensor2d(targets, [targets.length, 1]);

  // Étape 3 : Créer un modèle LSTM simple
  const model = tf.sequential();
  model.add(tf.layers.lstm({ units: 16, inputShape: [sequenceLength, 1] }));
  model.add(tf.layers.dense({ units: 1 }));

  model.compile({
    loss: 'meanSquaredError',
    optimizer: 'adam'
  });

  // Étape 4 : Entraîner
  await model.fit(xs, ys, {
    epochs: 50,
    verbose: 0,
    batchSize: 1
  });

  return { model, min, max };
}

module.exports = trainLSTMModel;
