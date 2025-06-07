import React from 'react';
import { Pie } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
} from 'chart.js';

ChartJS.register(ArcElement, Tooltip, Legend);

interface ExpenseData {
  category: string;
  amount: number;
}

const CATEGORY_COLORS: Record<string, string> = {
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
};

// Fonction pour normaliser le nom de la catégorie
const normalizeCategoryName = (category: string): string => {
  // Convertir la première lettre en majuscule et le reste en minuscule
  let normalized = category.charAt(0).toUpperCase() + category.slice(1).toLowerCase();

  // Gérer les cas spécifiques de singulier/pluriel ou de casse si nécessaire
  if (normalized === 'Abonnement') return 'Abonnements'; // 'Abonnement' (singulier) -> 'Abonnements' (pluriel)
  if (normalized === 'Facture') return 'Factures';       // 'Facture' (singulier) -> 'Factures' (pluriel)
  if (normalized === 'Alimentation') return 'Alimentation'; // 'alimentation' -> 'Alimentation'
  if (normalized === 'Transport') return 'Transport';
  if (normalized === 'Loisirs') return 'Loisirs';
  if (normalized === 'Santé') return 'Santé';
  if (normalized === 'Shopping') return 'Shopping';

  return normalized;
};

interface ExpensePieChartProps {
  data: ExpenseData[];
  title?: string;
}

const ExpensePieChart: React.FC<ExpensePieChartProps> = ({ data, title = 'Répartition des Dépenses par Catégorie' }) => {
  const total = data.reduce((sum, item) => sum + item.amount, 0);

  console.log("ExpensePieChart: Données reçues:", data);

  const backgroundColors = data.map(item => {
    // Utiliser la fonction de normalisation ici
    const normalizedCategory = normalizeCategoryName(item.category);
    const color = CATEGORY_COLORS[normalizedCategory];
    if (!color) {
      console.warn(`ExpensePieChart: Aucune couleur trouvée pour la catégorie normalisée "${normalizedCategory}" (original: "${item.category}"). Utilisation de la couleur par défaut.`);
    }
    return color || '#b2bec3';
  });

  console.log("ExpensePieChart: Couleurs générées:", backgroundColors);

  const chartData = {
    // Utiliser le label original pour l'affichage, mais la catégorie normalisée pour la couleur
    labels: data.map(item => item.category),
    datasets: [
      {
        data: data.map(item => item.amount),
        backgroundColor: backgroundColors,
        borderWidth: 1,
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: 'bottom' as const,
        labels: {
          font: { size: 14 },
          color: '#333',
          generateLabels: (chart: any) => {
            const dataset = chart.data.datasets[0];
            return chart.data.labels.map((label: string, i: number) => {
              const value = dataset.data[i];
              const percentage = total ? ((value / total) * 100).toFixed(0) : 0;
              return {
                text: `${label} (${percentage}%)`,
                fillStyle: dataset.backgroundColor[i],
                strokeStyle: dataset.backgroundColor[i],
                index: i,
              };
            });
          }
        }
      },
      tooltip: {
        callbacks: {
          label: function(context: any) {
            const label = context.label || '';
            const value = context.raw || 0;
            const percentage = total ? ((value / total) * 100).toFixed(1) : 0;
            return `${label}: ${value} TND (${percentage}%)`;
          },
        },
      },
    },
  };

  return (
    <div style={{ width: '100%', maxWidth: 600, margin: '0 auto' }}>
      <h2 style={{ textAlign: 'center' }}>{title}</h2>
      <Pie data={chartData} options={options} />
    </div>
  );
};

export default ExpensePieChart; 