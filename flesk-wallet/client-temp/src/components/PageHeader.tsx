import React from 'react';
import { Box, Typography, Paper, IconButton, Badge } from '@mui/material';
import NotificationsIcon from '@mui/icons-material/Notifications'; // Import de l'icône
console.log(">>> PageHeader.tsx chargé");

interface PageHeaderProps {
  title: string;
  icon?: React.ReactNode;
  notificationCount?: number; // Nouvelle prop optionnelle
}

const PageHeader: React.FC<PageHeaderProps> = ({ title, icon, notificationCount = 0 }) => {
  return (
    <Paper 
      elevation={0}
      sx={{ 
        p: 2, 
        mb: 3, 
        display: 'flex', 
        alignItems: 'center',
        bgcolor: 'rgba(255, 87, 51, 0.1)',
        borderRadius: 0,
        justifyContent: 'space-between' // Ajouté pour aligner à droite
      }}
    >
      <Box sx={{ display: 'flex', alignItems: 'center' }}>
        {icon && <Box sx={{ color: '#FF5733', mr: 2, fontSize: 32 }}>{icon}</Box>}
        <Typography variant="h4" sx={{ color: '#FF5733', fontWeight: 'bold' }}>
          {title}
        </Typography>
      </Box>

      {/* Nouveau bloc notifications */}
      <IconButton 
        sx={{ 
          color: '#FF5733',
          '&:hover': {
            backgroundColor: 'rgba(255, 87, 51, 0.1)'
          }
        }}
      >
        <Badge 
          badgeContent={notificationCount} 
          color="error"
          sx={{
            '& .MuiBadge-badge': {
              right: -3,
              top: 5,
              border: '2px solid rgba(255, 87, 51, 0.1)',
              padding: '0 4px'
            }
          }}
        >
          <NotificationsIcon fontSize="medium" />
        </Badge>
      </IconButton>
    </Paper>
  );
};

export default PageHeader;