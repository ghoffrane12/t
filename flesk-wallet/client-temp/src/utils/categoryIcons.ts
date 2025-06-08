import React from 'react';
import HomeIcon from '@mui/icons-material/Home';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import FastfoodIcon from '@mui/icons-material/Fastfood';
import CommuteIcon from '@mui/icons-material/Commute';
import FitnessCenterIcon from '@mui/icons-material/FitnessCenter';
import LocalHospitalIcon from '@mui/icons-material/LocalHospital'; // Santé
import SchoolIcon from '@mui/icons-material/School'; // Éducation
import LightbulbIcon from '@mui/icons-material/Lightbulb'; // Factures/Utilities
import CreditCardIcon from '@mui/icons-material/CreditCard'; // Abonnements
import AttachMoneyIcon from '@mui/icons-material/AttachMoney'; // Revenus générique
import AccountBalanceWalletIcon from '@mui/icons-material/AccountBalanceWallet'; // Investissements
import MoreHorizIcon from '@mui/icons-material/MoreHoriz'; // Autre/Default

type IconComponent = React.ElementType;

interface CategoryIconMap {
  [key: string]: IconComponent;
}

const CATEGORY_COLORS: Record<string, string> = {
  // Couleurs des catégories de dépenses
  'Alimentation': '#00b894',
  'Transport': '#2196F3',
  'Logement': '#636e72',
  'Loisirs': '#6c5ce7',
  'Santé': '#d35400',
  'Éducation': '#8e44ad',
  'Shopping': '#fdcb6e',
  'Factures': '#74b9ff',
  'Abonnements': '#fdcb6e',
  'Autre': '#e17055',

  // Couleurs des catégories de revenus (ajoutez celles qui sont pertinentes pour votre projet)
  "Salaire": "#4CAF50",
  "Investissements": "#26A69A",
  "Cadeau": "#FFB74D",
  // Ajoutez d'autres catégories/couleurs ici
};

const categoryIcons: CategoryIconMap = {
  // Catégories de dépenses
  "Alimentation": FastfoodIcon,
  "Transport": CommuteIcon,
  "Logement": HomeIcon,
  "Loisirs": FitnessCenterIcon,
  "Santé": LocalHospitalIcon,
  "Éducation": SchoolIcon,
  "Shopping": ShoppingCartIcon,
  "Factures": LightbulbIcon,
  "Abonnements": CreditCardIcon,
  "Autre": MoreHorizIcon,

  // Catégories de revenus (ajoutez celles qui sont pertinentes pour votre projet)
  "Salaire": AttachMoneyIcon,
  "Investissements": AccountBalanceWalletIcon,
  "Cadeau": AttachMoneyIcon,
  // Ajoutez d'autres catégories de revenus si elles existent

  // Catégories de prédiction si elles ont des icônes dédiées
  "Préd_Alimentation": FastfoodIcon,
  "Préd_Transport": CommuteIcon,
  "Préd_Logement": HomeIcon,
  // etc.
};

export const normalizeCategoryName = (category: string): string => {
  let normalized = category.charAt(0).toUpperCase() + category.slice(1).toLowerCase();
  if (normalized === 'Abonnement') return 'Abonnements';
  if (normalized === 'Facture') return 'Factures';
  return normalized;
};

export const getCategoryIcon = (categoryName: string): IconComponent => {
  const normalizedCategory = normalizeCategoryName(categoryName);
  return categoryIcons[normalizedCategory] || MoreHorizIcon;
};

export const getCategoryColor = (categoryName: string): string => {
  const normalizedCategory = normalizeCategoryName(categoryName);
  return CATEGORY_COLORS[normalizedCategory] || '#b2bec3'; // Couleur par défaut
}; 