import React from 'react';
import { Box, Typography, LinearProgress, Avatar, Paper } from '@mui/material';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import DirectionsCarIcon from '@mui/icons-material/DirectionsCar';
import PetsIcon from '@mui/icons-material/Pets';
import SchoolIcon from '@mui/icons-material/School';
import CheckroomIcon from '@mui/icons-material/Checkroom';
import HomeIcon from '@mui/icons-material/Home';
import SportsEsportsIcon from '@mui/icons-material/SportsEsports';
import LocalHospitalIcon from '@mui/icons-material/LocalHospital';
import ReceiptIcon from '@mui/icons-material/Receipt';
import SubscriptionsIcon from '@mui/icons-material/Subscriptions';
import MoreHorizIcon from '@mui/icons-material/MoreHoriz';

const iconMap: Record<string, React.ReactNode> = {
  'Épicerie': <ShoppingCartIcon />,
  'Transport': <DirectionsCarIcon />,
  'Animaux': <PetsIcon />,
  'Éducation': <SchoolIcon />,
  'Vêtements': <CheckroomIcon />,
  'Logement': <HomeIcon />,
  'Loisirs': <SportsEsportsIcon />,
  'Santé': <LocalHospitalIcon />,
  'Factures': <ReceiptIcon />,
  'Abonnement': <SubscriptionsIcon />,
  'Autre': <MoreHorizIcon />
};

const colorMap: Record<string, string> = {
  'Épicerie': '#43d672',
  'Transport': '#1cc6e7',
  'Animaux': '#1ca7e7',
  'Éducation': '#6c63ff',
  'Vêtements': '#a259e6',
  'Logement': '#ff6b6b',
  'Loisirs': '#ffd93d',
  'Santé': '#ff4757',
  'Factures': '#2ed573',
  'Abonnement': '#1e90ff',
  'Autre': '#747d8c'
};

export interface Budget {
  id: string;
  name: string;
  amount: number;
  remainingAmount: number;
  category: string;
  period: 'DAILY' | 'WEEKLY' | 'MONTHLY' | 'YEARLY';
  startDate: string;
  endDate?: string;
  status: 'ACTIVE' | 'INACTIVE' | 'COMPLETED';
  notifications: {
    enabled: boolean;
    threshold: number;
  };
  description?: string;
  tags: string[];
}

const BudgetSummary: React.FC<{ budgets: Budget[] }> = ({ budgets }) => {
  console.log('Budgets reçus dans BudgetSummary:', budgets);
  return (
    <Paper sx={{ p: 3, borderRadius: 3, boxShadow: '0 2px 12px 0 rgba(60,72,100,0.06)', bgcolor: '#fff', minWidth: 300 }}>
      <Typography variant="h6" sx={{ mb: 3, fontWeight: 700, color: '#2d3a66', fontSize: 22 }}>
        Budgets mensuels
      </Typography>
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
        {budgets.map((b) => (
          <Box key={b.id} sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <Avatar sx={{ bgcolor: colorMap[b.category] || '#43d672', width: 40, height: 40, mr: 1 }}>
              {iconMap[b.category] || <ShoppingCartIcon />}
            </Avatar>
            <Box sx={{ flex: 1 }}>
              <Typography variant="subtitle1" sx={{ fontWeight: 700, color: '#2d3a66', fontSize: 16 }}>
                {b.category}
              </Typography>
              <LinearProgress
                variant="determinate"
                value={Math.min(100, ((b.amount - b.remainingAmount) / b.amount) * 100)}
                sx={{
                  height: 7,
                  borderRadius: 5,
                  backgroundColor: '#f1f2fa',
                  mt: 0.5,
                  '& .MuiLinearProgress-bar': { backgroundColor: colorMap[b.category] || '#43d672', borderRadius: 5 }
                }}
              />
            </Box>
            <Typography variant="body1" sx={{ ml: 2, minWidth: 70, fontWeight: 700, color: colorMap[b.category] || '#222', fontSize: 16, textAlign: 'right' }}>
              {b.amount - b.remainingAmount} <span style={{ color: '#b0b3c7', fontWeight: 500 }}>/ {b.amount}</span>
            </Typography>
          </Box>
        ))}
      </Box>
    </Paper>
  );
};

export default BudgetSummary; 