// Validation des transactions
exports.validateTransaction = (data) => {
  const errors = [];

  // Validation du type
  if (!data.type) {
    errors.push('Le type est requis');
  } else if (!['EXPENSE', 'INCOME'].includes(data.type)) {
    errors.push('Le type doit être EXPENSE ou INCOME');
  }

  // Validation du montant
  if (!data.amount && data.amount !== 0) {
    errors.push('Le montant est requis');
  } else if (typeof data.amount !== 'number' || data.amount < 0) {
    errors.push('Le montant doit être un nombre positif');
  }

  // Validation de la catégorie
  if (!data.category) {
    errors.push('La catégorie est requise');
  }

  // Validation de la description (optionnelle maintenant)
  if (data.description && typeof data.description !== 'string') {
    errors.push('La description doit être une chaîne de caractères');
  }

  // Validation de la date
  if (data.date) {
    const dateValue = new Date(data.date);
    if (isNaN(dateValue.getTime())) {
      errors.push('La date est invalide');
    }
  }

  // Validation des coordonnées de localisation si présentes
  if (data.location && data.location.coordinates) {
    const [longitude, latitude] = data.location.coordinates;
    if (typeof longitude !== 'number' || typeof latitude !== 'number' ||
        longitude < -180 || longitude > 180 || latitude < -90 || latitude > 90) {
      errors.push('Les coordonnées de localisation sont invalides');
    }
  }

  // Validation de la période récurrente si transaction récurrente
  if (data.recurring && !data.recurringPeriod) {
    errors.push('La période de récurrence est requise pour les transactions récurrentes');
  } else if (data.recurringPeriod && 
             !['DAILY', 'WEEKLY', 'MONTHLY', 'YEARLY'].includes(data.recurringPeriod)) {
    errors.push('La période de récurrence est invalide');
  }

  return {
    isValid: errors.length === 0,
    errors
  };
}; 