import React from 'react';
import { AppBar, Toolbar, Typography } from '@mui/material';

const SubscriptionsPage: React.FC = () => {
  return (
    <AppBar position="static" sx={{ 
      bgcolor: '#FF5733', 
      boxShadow: '0 1px 3px rgba(0, 0, 0, 0.05)',
      borderBottom: '2px solid rgba(200, 200, 200, 0.8)',
      borderRadius: 0
    }}>
      <Toolbar>
        <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
          Abonnements
        </Typography>
      </Toolbar>
    </AppBar>
  );
};

export default SubscriptionsPage; 