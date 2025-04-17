import React from 'react';
import { Box } from '@mui/material';
import BudgetList from '../../components/BudgetList';

const BudgetsPage: React.FC = () => {
  return (
    <Box sx={{ p: 3 }}>
      <BudgetList />
    </Box>
  );
};

export default BudgetsPage; 