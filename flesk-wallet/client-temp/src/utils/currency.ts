export const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat('fr-TN', {
    style: 'currency',
    currency: 'TND',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  }).format(amount);
};

// Fonction pour formater le montant sans le symbole de devise
export const formatAmount = (amount: number): string => {
  return new Intl.NumberFormat('fr-TN', {
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  }).format(amount);
}; 