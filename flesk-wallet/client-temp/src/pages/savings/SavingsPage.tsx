import React, { useState } from 'react';
import {
  Box,
  Typography,
  AppBar,
  Toolbar,
  Paper,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  TextField,
  DialogActions,
  MenuItem,
} from '@mui/material';
import {
  Add as AddIcon,
} from '@mui/icons-material';
import Sidebar from '../../components/Sidebar';

interface SavingsGoal {
  id: string;
  name: string;
  targetAmount: number;
  currentAmount: number;
  deadline: string;
  category: string;
}

const SavingsPage: React.FC = () => {
  const [openDialog, setOpenDialog] = useState(false);
  const [goals] = useState<SavingsGoal[]>([]);

  const categories = [
    "Voyage",
    "Technologie",
    "Voiture",
    "Maison",
    "Éducation",
    "Autre"
  ];

  const [newGoal, setNewGoal] = useState<Omit<SavingsGoal, 'id'>>({
    name: '',
    targetAmount: 0,
    currentAmount: 0,
    deadline: '',
    category: ''
  });

  const handleAddGoal = () => {
    setOpenDialog(false);
    setNewGoal({
      name: '',
      targetAmount: 0,
      currentAmount: 0,
      deadline: '',
      category: ''
    });
  };

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh', bgcolor: '#F8F9FA' }}>
      <Sidebar />
      
      <Box component="main" sx={{ flexGrow: 1, ml: '280px' }}>
        {/* Barre orange supérieure */}
        <AppBar position="static" sx={{ bgcolor: '#FF5733', boxShadow: 'none' }}>
          <Toolbar sx={{ minHeight: '64px !important' }} />
        </AppBar>

        {/* Titre de la page */}
        <Box sx={{ p: 3 }}>
          <Typography variant="h4" sx={{ color: '#000000', mb: 4, fontWeight: 500 }}>
            Épargne
          </Typography>

          {/* Bouton Ajouter */}
          <Box sx={{ display: 'flex', justifyContent: 'flex-end', mb: 4 }}>
            <Button
              variant="contained"
              startIcon={<AddIcon />}
              onClick={() => setOpenDialog(true)}
              sx={{
                bgcolor: '#FF5733',
                '&:hover': { bgcolor: '#ff6b4a' },
              }}
            >
              Nouvel objectif
            </Button>
          </Box>

          {/* Contenu de la page */}
          <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 3 }}>
            {/* Le contenu spécifique à l'épargne sera ajouté ici */}
          </Box>
        </Box>
      </Box>

      <Dialog open={openDialog} onClose={() => setOpenDialog(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Nouvel objectif d'épargne</DialogTitle>
        <DialogContent>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 2 }}>
            <TextField
              label="Nom de l'objectif"
              fullWidth
              value={newGoal.name}
              onChange={(e) => setNewGoal(prev => ({ ...prev, name: e.target.value }))}
            />
            <TextField
              label="Montant cible (€)"
              type="number"
              fullWidth
              value={newGoal.targetAmount}
              onChange={(e) => setNewGoal(prev => ({ ...prev, targetAmount: Number(e.target.value) }))}
            />
            <TextField
              label="Montant actuel (€)"
              type="number"
              fullWidth
              value={newGoal.currentAmount}
              onChange={(e) => setNewGoal(prev => ({ ...prev, currentAmount: Number(e.target.value) }))}
            />
            <TextField
              label="Date d'échéance"
              type="date"
              fullWidth
              InputLabelProps={{ shrink: true }}
              value={newGoal.deadline}
              onChange={(e) => setNewGoal(prev => ({ ...prev, deadline: e.target.value }))}
            />
            <TextField
              select
              label="Catégorie"
              fullWidth
              value={newGoal.category}
              onChange={(e) => setNewGoal(prev => ({ ...prev, category: e.target.value }))}
            >
              {categories.map((category) => (
                <MenuItem key={category} value={category}>
                  {category}
                </MenuItem>
              ))}
            </TextField>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDialog(false)}>Annuler</Button>
          <Button 
            onClick={handleAddGoal}
            sx={{ bgcolor: '#FF5733', color: 'white', '&:hover': { bgcolor: '#ff6b4a' } }}
          >
            Ajouter
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default SavingsPage; 