import React from 'react';
import { Box, Typography } from '@mui/material';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js';
import { Bar } from 'react-chartjs-2';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

const options = {
  responsive: true,
  plugins: {
    legend: {
      position: 'top' as const,
    },
  },
  scales: {
    y: {
      beginAtZero: true,
    },
  },
};

const labels = ['Jan', 'Fév', 'Mar', 'Avr', 'Mai', 'Jun', 'Jul', 'Aoû', 'Sep', 'Oct', 'Nov', 'Déc'];

// Sample data - replace with real data from your backend
const data = {
  labels,
  datasets: [
    {
      label: 'Dépenses',
      data: labels.map(() => Math.random() * 1000),
      backgroundColor: '#FF5733',
    },
    {
      label: 'Revenus',
      data: labels.map(() => Math.random() * 1000),
      backgroundColor: '#4CAF50',
    },
  ],
};

const ExpenseRevenueChart = () => {
  return (
    <Box sx={{ p: 3, bgcolor: 'white', borderRadius: 2, boxShadow: 1 }}>
      <Typography variant="h6" sx={{ mb: 2 }}>
        Dépenses vs Revenus
      </Typography>
      <Bar options={options} data={data} height={300} />
    </Box>
  );
};

export default ExpenseRevenueChart; 