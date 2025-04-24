import React from 'react';
import {
  Box,
  Typography,
  Grid,
  Paper,
  LinearProgress,
  Button,
  IconButton,
} from '@mui/material';
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
} from '@mui/icons-material';
import Sidebar from '../components/Sidebar';

const SavingsPage: React.FC = () => {
  // Ces données seront remplacées par des appels API
  const savingsGoals = [
    {
      id: 1,
      title: "Achat voiture",
      target: 20000,
      current: 15000,
      deadline: "2024-12-31"
    },
    {
      id: 2,
      title: "Vacances d'été",
      target: 5000,
      current: 2500,
      deadline: "2024-06-30"
    },
    {
      id: 3,
      title: "Fond d'urgence",
      target: 10000,
      current: 8000,
      deadline: "2024-12-31"
    }
  ];

  const SavingsGoalCard = ({ goal }: { goal: any }) => {
    const progress = (goal.current / goal.target) * 100;
    const remainingAmount = goal.target - goal.current;
    const deadline = new Date(goal.deadline).toLocaleDateString('fr-FR');

    return (
      <Paper
        elevation={0}
        sx={{
          p: 3,
          bgcolor: 'white',
          borderRadius: 2,
          border: '1px solid rgba(0, 0, 0, 0.12)',
        }}
      >
        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
          <Typography variant="h6" component="h3">
            {goal.title}
          </Typography>
          <Box>
            <IconButton size="small" sx={{ color: '#4CAF50' }}>
              <EditIcon />
            </IconButton>
            <IconButton size="small" sx={{ color: '#F44336' }}>
              <DeleteIcon />
            </IconButton>
          </Box>
        </Box>

        <LinearProgress
          variant="determinate"
          value={progress}
          sx={{
            height: 8,
            borderRadius: 4,
            mb: 2,
            bgcolor: 'rgba(76, 175, 80, 0.1)',
            '& .MuiLinearProgress-bar': {
              bgcolor: '#4CAF50',
            },
          }}
        />

        <Grid container spacing={2}>
          <Grid item xs={6}>
            <Typography variant="body2" color="textSecondary">
              Progression
            </Typography>
            <Typography variant="h6">
              {progress.toFixed(0)}%
            </Typography>
          </Grid>
          <Grid item xs={6}>
            <Typography variant="body2" color="textSecondary">
              Reste à épargner
            </Typography>
            <Typography variant="h6">
              {remainingAmount.toLocaleString()}€
            </Typography>
          </Grid>
          <Grid item xs={12}>
            <Typography variant="body2" color="textSecondary">
              Objectif : {goal.target.toLocaleString()}€
            </Typography>
            <Typography variant="body2" color="textSecondary">
              Date limite : {deadline}
            </Typography>
          </Grid>
        </Grid>
      </Paper>
    );
  };

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh', bgcolor: '#F8F9FA' }}>
      <Sidebar />
      <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
        <Box sx={{ mb: 4, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Typography variant="h4" component="h1">
            Épargne
          </Typography>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            sx={{
              bgcolor: '#4CAF50',
              '&:hover': {
                bgcolor: '#45a049',
              },
            }}
          >
            Nouvel objectif
          </Button>
        </Box>

        <Grid container spacing={3}>
          {savingsGoals.map((goal) => (
            <Grid item xs={12} md={6} lg={4} key={goal.id}>
              <SavingsGoalCard goal={goal} />
            </Grid>
          ))}
        </Grid>
      </Box>
    </Box>
  );
};

export default SavingsPage; 