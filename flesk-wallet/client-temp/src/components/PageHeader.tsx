import React from 'react';
import { Box, Typography, Paper, IconButton, Badge } from '@mui/material';
import NotificationsIcon from '@mui/icons-material/Notifications'; // Import de l'icône
console.log(">>> PageHeader.tsx chargé");

/**
 * Interface des propriétés du composant PageHeader
 * @interface PageHeaderProps
 * @property {string} title - Le texte du titre à afficher dans l'en-tête
 * @property {React.ReactNode} [icon] - Icône optionnelle à afficher à côté du titre
 */
interface PageHeaderProps {
  title: string;
  icon?: React.ReactNode;
  notificationCount?: number; // Nouvelle prop optionnelle
}

/**
 * Composant PageHeader
 * 
 * Un composant d'en-tête réutilisable qui affiche un titre et une icône optionnelle.
 * Utilisé en haut des pages pour fournir des en-têtes cohérents dans toute l'application.
 * 
 * @param {PageHeaderProps} props - Les propriétés du composant
 * @returns {JSX.Element} Un en-tête stylisé avec titre et icône optionnelle
 */
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
        justifyContent: 'space-between'
      }}
    >
      <Box sx={{ display: 'flex', alignItems: 'center' }}>
        {icon && <Box sx={{ color: '#FF5733', mr: 2, fontSize: 32 }}>{icon}</Box>}
        <Typography variant="h4" sx={{ color: '#FF5733', fontWeight: 'bold' }}>
          {title}
        </Typography>
      </Box>

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