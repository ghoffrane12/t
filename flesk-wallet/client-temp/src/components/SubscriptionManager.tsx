import React from 'react';
import {
  Box,
  Typography,
  Paper,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  ListItemSecondaryAction,
  IconButton,
  Chip,
  Tooltip,
} from '@mui/material';
import NotificationsActiveIcon from '@mui/icons-material/NotificationsActive';
import DeleteIcon from '@mui/icons-material/Delete';
import AutorenewIcon from '@mui/icons-material/Autorenew';

interface Subscription {
  id: number;
  name: string;
  amount: number;
  nextBilling: string;
  category: string;
  status: 'active' | 'expiring-soon' | 'inactive';
}

const subscriptions: Subscription[] = [
  {
    id: 1,
    name: 'Netflix',
    amount: 15.99,
    nextBilling: '15/10/2024',
    category: 'Streaming',
    status: 'active',
  },
  {
    id: 2,
    name: 'Spotify',
    amount: 9.99,
    nextBilling: '20/10/2024',
    category: 'Musique',
    status: 'active',
  },
  {
    id: 3,
    name: 'Salle de sport',
    amount: 45.00,
    nextBilling: '01/10/2024',
    category: 'Sport',
    status: 'expiring-soon',
  },
];

const SubscriptionManager: React.FC = () => {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return '#4CAF50';
      case 'expiring-soon':
        return '#FFC300';
      case 'inactive':
        return '#FF5733';
      default:
        return '#757575';
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'active':
        return 'Actif';
      case 'expiring-soon':
        return 'Expire bientôt';
      case 'inactive':
        return 'Inactif';
      default:
        return status;
    }
  };

  return (
    <Box sx={{ p: 3, bgcolor: 'white', borderRadius: 2, boxShadow: 1 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h6">Gestion des Abonnements</Typography>
        <Tooltip title="Détection automatique des abonnements récurrents">
          <IconButton>
            <AutorenewIcon />
          </IconButton>
        </Tooltip>
      </Box>

      <List>
        {subscriptions.map((subscription) => (
          <Paper 
            key={subscription.id}
            sx={{ 
              mb: 2,
              '&:hover': {
                boxShadow: 2,
              },
            }}
          >
            <ListItem>
              <ListItemIcon>
                {subscription.status === 'expiring-soon' && (
                  <Tooltip title="Renouvellement proche">
                    <NotificationsActiveIcon color="warning" />
                  </Tooltip>
                )}
              </ListItemIcon>
              <ListItemText
                primary={
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <Typography variant="subtitle1" sx={{ fontWeight: 'bold', mr: 1 }}>
                      {subscription.name}
                    </Typography>
                    <Chip
                      label={getStatusLabel(subscription.status)}
                      size="small"
                      sx={{
                        backgroundColor: `${getStatusColor(subscription.status)}20`,
                        color: getStatusColor(subscription.status),
                        fontWeight: 'bold',
                      }}
                    />
                  </Box>
                }
                secondary={
                  <Box>
                    <Typography variant="body2" color="text.secondary">
                      Catégorie: {subscription.category}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Prochain paiement: {subscription.nextBilling}
                    </Typography>
                  </Box>
                }
              />
              <ListItemSecondaryAction>
                <Typography 
                  variant="subtitle1" 
                  sx={{ 
                    fontWeight: 'bold',
                    color: '#1B1B3A',
                    mr: 2,
                  }}
                >
                  {subscription.amount} DT
                </Typography>
                <IconButton edge="end" aria-label="delete">
                  <DeleteIcon />
                </IconButton>
              </ListItemSecondaryAction>
            </ListItem>
          </Paper>
        ))}
      </List>
    </Box>
  );
};

export default SubscriptionManager; 