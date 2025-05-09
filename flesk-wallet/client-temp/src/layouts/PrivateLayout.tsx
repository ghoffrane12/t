// src/layouts/PrivateLayout.tsx
import React from 'react';
import Sidebar from '../components/Sidebar';
import PageHeader from '../components/PageHeader';
import { Box } from '@mui/material';

const PrivateLayout = ({ children }: { children: React.ReactNode }) => (
  <Box sx={{ display: 'flex', minHeight: '100vh' }}>
    <Sidebar />
    <Box component="main" sx={{ flexGrow: 1, ml: '280px' }}>
    <PageHeader title="Titre par défaut ou dynamique" />
    <Box sx={{ p: 3 }}>
        {children}
      </Box>
    </Box>
  </Box>
);

export default PrivateLayout;
