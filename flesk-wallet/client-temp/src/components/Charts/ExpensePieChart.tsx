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

interface ExpensePieChartProps {
  data: ExpenseData[];
  title?: string;
}

const ExpensePieChart: React.FC<ExpensePieChartProps> = ({ data, title = 'Répartition des Dépenses par Catégorie' }) => {
  const total = data.reduce((sum, item) => sum + item.amount, 0);

  const chartData = {
    labels: data.map(item => item.category),
    datasets: [
      {
        data: data.map(item => item.amount),
        backgroundColor: data.map(item => CATEGORY_COLORS[item.category] || '#b2bec3'),
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