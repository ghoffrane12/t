import React from 'react';
import { Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

interface Prediction {
  category: string;
  predicted_total: number;
}

interface Props {
  predictions: Prediction[];
}

const PredictionBarChart: React.FC<Props> = ({ predictions }) => {
  const data = {
    labels: predictions.map((p) => p.category),
    datasets: [
      {
        label: 'Dépenses prévues (TND)',
        data: predictions.map((p) => p.predicted_total),
        backgroundColor: (ctx: any) => {
          const gradient = ctx.chart.ctx.createLinearGradient(0, 0, 0, 300);
          gradient.addColorStop(0, '#42a5f5');
          gradient.addColorStop(1, '#1976d2');
          return gradient;
        },
        borderRadius: 6,
        barThickness: 30, // plus fin que la valeur par défaut
        hoverBackgroundColor: '#1565c0',
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: { position: 'top' as const },
      title: { display: true, text: 'Prévision des dépenses par catégorie' },
      tooltip: {
        callbacks: {
          label: (context: any) => `${context.parsed.y} TND`,
        },
      },
    },
    scales: {
      x: {
        ticks: {
          color: '#555',
          font: { weight: 'bold' as const },
        },
        grid: {
          display: false,
        },
      },
      y: {
        ticks: {
          color: '#777',
        },
        grid: {
          color: '#e0e0e0',
        },
      },
    },
  };

  return <Bar data={data} options={options} />;
};

export default PredictionBarChart;
