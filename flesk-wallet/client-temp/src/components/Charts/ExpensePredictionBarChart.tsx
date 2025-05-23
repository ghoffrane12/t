import React from 'react';
import { Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Tooltip,
  Legend,
} from 'chart.js';
import { Box, Paper, Typography } from '@mui/material';

ChartJS.register(CategoryScale, LinearScale, BarElement, Tooltip, Legend);

interface Props {
  predictions: { category: string; amount: number }[];
}

const ExpensePredictionBarChart: React.FC<Props> = ({ predictions }) => {
  const maxPrediction = Math.max(...predictions.map(p => p.amount));

  const data = {
    labels: predictions.map(p => p.category),
    datasets: [
      {
        label: 'Prévision des dépenses (TND)',
        data: predictions.map(p => p.amount),
        backgroundColor: predictions.map((_, index) => {
          const colors = ['#FF7043', '#42A5F5', '#66BB6A', '#AB47BC', '#FFA726'];
          return colors[index % colors.length];
        }),
        borderRadius: 8,
        barPercentage: 0.6,
        categoryPercentage: 0.6,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
      tooltip: {
        callbacks: {
          label: function (context: any) {
            return `${context.raw.toFixed(2)} TND`;
          },
        },
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        suggestedMax: Math.ceil(maxPrediction * 1.1),
        ticks: {
          callback: function (
            tickValue: string | number
          ): string {
            return `${tickValue} TND`;
          },
        },
      },
    },
  };

  return (
    <Box sx={{ maxWidth: 700, margin: 'auto', p: 2 }}>
      <Paper elevation={3} sx={{ p: 3 }}>
        <Typography variant="h6" gutterBottom>
          Prévision des dépenses par catégorie
        </Typography>
        <Box sx={{ height: 400 }}>
          <Bar data={data} options={options} />
        </Box>
      </Paper>
    </Box>
  );
};

export default ExpensePredictionBarChart;
