import React from 'react';
import { Box, Typography, Paper } from '@mui/material';

interface PageHeaderProps {
  title: string;
  icon?: React.ReactNode;
}

const PageHeader: React.FC<PageHeaderProps> = ({ title, icon }) => {
  return (
    <Paper 
      elevation={0}
      sx={{ 
        p: 2, 
        mb: 3, 
        display: 'flex', 
        alignItems: 'center',
        bgcolor: 'rgba(255, 87, 51, 0.1)',
        borderRadius: 2
      }}
    >
      {icon && <Box sx={{ color: '#FF5733', mr: 2, fontSize: 32 }}>{icon}</Box>}
      <Typography variant="h4" sx={{ color: '#FF5733', fontWeight: 'bold' }}>
        {title}
      </Typography>
    </Paper>
  );
};

export default PageHeader; 