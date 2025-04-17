import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { Box } from '@mui/material';
import Transactions from './Transactions';

const DashboardContent: React.FC = () => {
  return (
    <Box sx={{ flexGrow: 1, p: 3 }}>
      <Routes>
        <Route path="/" element={<Transactions />} />
        {/* Autres routes du dashboard */}
      </Routes>
    </Box>
  );
};

export default DashboardContent; 