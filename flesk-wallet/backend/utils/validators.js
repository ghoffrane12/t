exports.validateTransaction = (data) => {
  const errors = [];

  // Validation du montant
  if (!data.amount || data.amount <= 0) {
    errors.push('Le montant doit être supérieur à 0');
  }

  // Validation du type
  if (!data.type || !['EXPENSE', 'INCOME'].includes(data.type)) {
    errors.push('Le type doit être EXPENSE ou INCOME');
  }

  // Validation de la catégorie
  if (!data.category) {
    errors.push('La catégorie est requise');
  } else {
    if (!data.category.id) errors.push('L\'identifiant de la catégorie est requis');
    if (!data.category.name) errors.push('Le nom de la catégorie est requis');
    if (!data.category.icon) errors.push('L\'icône de la catégorie est requise');
    if (!data.category.type || !['EXPENSE', 'INCOME'].includes(data.category.type)) {
      errors.push('Le type de la catégorie doit être EXPENSE ou INCOME');
    }
  }

  // Validation de la description
  if (!data.description || data.description.trim().length === 0) {
    errors.push('La description est requise');
  }

  // Validation de la date
  if (!data.date || isNaN(new Date(data.date).getTime())) {
    errors.push('La date est invalide');
  }

  return {
    isValid: errors.length === 0,
    errors
  };
}; 