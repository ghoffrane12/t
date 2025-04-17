import React from 'react';
import { Box, Grid, Paper, Typography, IconButton } from '@mui/material';
import AddCircleIcon from '@mui/icons-material/AddCircle';
import ExpenseRevenueChart from '../../components/ExpenseRevenueChart';
import TransactionHistory from '../../components/TransactionHistory';
import SmartBudget from '../../components/SmartBudget';
import SubscriptionManager from '../../components/SubscriptionManager';

const Dashboard = () => {
  const walletBalance = '800 DT';

  return (
    <Box sx={{ p: 3 }}>
      {/* Header with Add Button */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h5" sx={{ fontWeight: 'bold' }}>
          Tableau de bord
        </Typography>
        <IconButton 
          sx={{ 
            bgcolor: '#FF5733',
            color: 'white',
            '&:hover': {
              bgcolor: '#E64A2E',
            },
          }}
        >
          <AddCircleIcon />
        </IconButton>
      </Box>

      <Grid container spacing={3}>
        {/* Wallet Balance */}
        <Grid item xs={12} md={4}>
          <Paper 
            sx={{ 
              p: 3,
              bgcolor: '#1B1B3A',
              color: 'white',
              borderRadius: 2,
              height: '100%',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
            }}
          >
            <Typography variant="subtitle1" sx={{ mb: 1 }}>
              WALLET
            </Typography>
            <Typography variant="h4" sx={{ fontWeight: 'bold' }}>
              {walletBalance}
            </Typography>
          </Paper>
        </Grid>

        {/* Smart Budget Summary */}
        <Grid item xs={12} md={8}>
          <SmartBudget />
        </Grid>

        {/* Chart */}
        <Grid item xs={12}>
          <ExpenseRevenueChart />
        </Grid>

        {/* Subscription Manager */}
        <Grid item xs={12} md={6}>
          <SubscriptionManager />
        </Grid>

        {/* Recent Transactions */}
        <Grid item xs={12} md={6}>
          <TransactionHistory />
        </Grid>
      </Grid>
    </Box>
  );
};

export default Dashboard; 