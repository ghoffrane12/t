import React from 'react';
import {
  Box,
  Typography,
  Paper,
} from '@mui/material';
import { Notifications } from '@mui/icons-material';

const NotificationsPage = () => {
  return (
    <Box sx={{ p: 3 }}>
      <Paper 
        elevation={0}
        sx={{ 
          p: 2, 
          mb: 3, 
          display: 'flex', 
          alignItems: 'center',
          bgcolor: '#FFF3E0',
          borderRadius: 2
        }}
      >
        <Notifications sx={{ color: '#FF9800', mr: 2, fontSize: 32 }} />
        <Typography variant="h4" sx={{ color: '#FF9800', fontWeight: 'bold' }}>
          Notifications
        </Typography>
      </Paper>

      {/* Contenu de la page */}
    </Box>
  );
};

export default NotificationsPage; 