import React, { useState, useEffect } from 'react';
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
  DialogActions,
  TextField,
  MenuItem,
  Switch,
  FormControlLabel,
  Chip,
  IconButton,
  CircularProgress,
  Alert,
  Divider,
  LinearProgress,
} from '@mui/material';
import {
  Add as AddIcon,
  Close as CloseIcon,
  Delete as DeleteIcon,
  Edit as EditIcon,
  Remove as RemoveIcon,
} from '@mui/icons-material';
import Sidebar from '../../components/Sidebar';
import { Budget, getBudgets, createBudget, deleteBudget, updateBudget, deductFromBudget, BudgetCreatePayload } from '../../services/budgetService';

// Liste harmonisée des catégories
const categories = [
  'Alimentation',
  'Transport',
  'Logement',
  'Loisirs',
  'Santé',
  'Éducation',
  'Shopping',
  'Factures',
  'Abonnement',
  'Autre'
];

const periods = [
  { value: 'DAILY', label: 'Quotidien' },
  { value: 'WEEKLY', label: 'Hebdomadaire' },
  { value: 'MONTHLY', label: 'Mensuel' },
  { value: 'YEARLY', label: 'Annuel' }
];

const BudgetsPage: React.FC = () => {
  const [openDialog, setOpenDialog] = useState(false);
  const [budgets, setBudgets] = useState<Budget[]>([]);
  const [newTag, setNewTag] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedBudget, setSelectedBudget] = useState<Budget | null>(null);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [deductDialogOpen, setDeductDialogOpen] = useState(false);
  const [selectedBudgetForDeduction, setSelectedBudgetForDeduction] = useState<Budget | null>(null);
  const [deductionAmount, setDeductionAmount] = useState<number>(0);
  const [showExceedWarning, setShowExceedWarning] = useState(false);
  const [exceedWarningMessage, setExceedWarningMessage] = useState('');
  const [newBudget, setNewBudget] = useState<BudgetCreatePayload>({
    name: '',
    amount: 0,
    category: '',
    period: 'MONTHLY',
    startDate: new Date().toISOString().split('T')[0],
    endDate: '',
    status: 'ACTIVE',
    notifications: { enabled: true, threshold: 80 },
    description: '',
    tags: []
  });
  const [categoryExistsError, setCategoryExistsError] = useState<string | null>(null);
  const [showExistingBudgetModal, setShowExistingBudgetModal] = useState<boolean>(false);
  const [existingBudgetCategory, setExistingBudgetCategory] = useState<string>('');

  // Récupérer les budgets au montage
  useEffect(() => { fetchBudgets(); }, []);

  const fetchBudgets = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await getBudgets();
      setBudgets(Array.isArray(response) ? response : []);
    } catch (err) {
      setError('Erreur lors du chargement des budgets');
      setBudgets([]);
    } finally {
      setLoading(false);
    }
  };

  const resetBudgetForm = () => {
    setNewBudget({
      name: '',
      amount: 0,
      category: '',
      period: 'MONTHLY',
      startDate: new Date().toISOString().split('T')[0],
      endDate: '',
      status: 'ACTIVE',
      notifications: { enabled: true, threshold: 80 },
      description: '',
      tags: []
    });
  };

  const handleAddTag = () => {
    if (newTag.trim() && !newBudget.tags.includes(newTag.trim())) {
      setNewBudget((prev) => ({ ...prev, tags: [...prev.tags, newTag.trim()] }));
      setNewTag('');
    }
  };

  const handleRemoveTag = (tagToRemove: string) => {
    setNewBudget((prev) => ({ ...prev, tags: prev.tags.filter((tag) => tag !== tagToRemove) }));
  };

  const handleAddBudget = async () => {
    // Check for existing active budget with the same category
    const existingBudget = budgets.find(
      (budget) => budget.category === newBudget.category && budget.status === 'ACTIVE'
    );

    if (existingBudget) {
      // setError(`Il existe déjà un budget actif pour la catégorie "${newBudget.category}".`);
      // setLoading(false);
      // return; // Stop here if duplicate found
      setExistingBudgetCategory(newBudget.category);
      setShowExistingBudgetModal(true);
      return;
    }

    try {
      setLoading(true);
      setError(null);

      const token = localStorage.getItem('token');
      if (!token) {
        setError('Utilisateur non authentifié');
        setLoading(false);
        return;
      }
      const data = await createBudget({ ...newBudget });
      setBudgets([...budgets, data]);
      setOpenDialog(false);
      resetBudgetForm();
    } catch (err) {
      setError('Erreur lors de la création du budget');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteBudget = async (id: string) => {
    try {
      setLoading(true);
      setError(null);
      await deleteBudget(id);
      await fetchBudgets();
    } catch (err) {
      setError('Erreur lors de la suppression du budget');
    } finally {
      setLoading(false);
    }
  };

  const handleEditBudget = (budget: Budget) => {
    setSelectedBudget(budget);
    setNewBudget({
      name: budget.name,
      amount: budget.amount,
      category: budget.category,
      period: budget.period,
      startDate: budget.startDate,
      endDate: budget.endDate || '',
      status: budget.status,
      notifications: budget.notifications,
      description: budget.description || '',
      tags: budget.tags
    });
    setEditDialogOpen(true);
  };

  const handleUpdateBudget = async () => {
    if (!selectedBudget) return;
    try {
      setLoading(true);
      setError(null);
      await updateBudget(selectedBudget.id, newBudget);
      await fetchBudgets();
      setEditDialogOpen(false);
      setSelectedBudget(null);
    } catch (err) {
      setError('Erreur lors de la mise à jour du budget');
    } finally {
      setLoading(false);
    }
  };

  const handleOpenDeductDialog = (budget: Budget) => {
    setSelectedBudgetForDeduction(budget);
    setDeductionAmount(0);
    setShowExceedWarning(false);
    setExceedWarningMessage('');
    setDeductDialogOpen(true);
  };

  const handleDeductFromBudget = async () => {
    if (!selectedBudgetForDeduction || deductionAmount <= 0) return;

    if (deductionAmount > selectedBudgetForDeduction.remainingAmount) {
      setExceedWarningMessage(
        `Le montant à déduire (${deductionAmount.toLocaleString('fr-TN')} DT) dépasse le montant restant (${selectedBudgetForDeduction.remainingAmount.toLocaleString('fr-TN')} DT) pour "${selectedBudgetForDeduction.name}".\nVoulez-vous modifier le montant à déduire ?`
      );
      setShowExceedWarning(true);
      return;
    }

    try {
      setLoading(true);
      setError(null);
      const updatedBudget = await deductFromBudget(selectedBudgetForDeduction.id, deductionAmount);
      setBudgets(prevBudgets => prevBudgets.map(budget => budget.id === updatedBudget.id ? updatedBudget : budget));
      setDeductDialogOpen(false);
      setSelectedBudgetForDeduction(null);
      setDeductionAmount(0);
      setShowExceedWarning(false);
      setExceedWarningMessage('');
    } catch (err) {
      setError('Erreur lors de la déduction du montant');
    } finally {
      setLoading(false);
    }
  };

  const handleCloseDeductDialog = () => {
    setDeductDialogOpen(false);
    setShowExceedWarning(false);
    setExceedWarningMessage('');
    setSelectedBudgetForDeduction(null);
    setDeductionAmount(0);
  };

  const handleChangeAmountClick = () => {
    setShowExceedWarning(false);
  };

  const getProgressColor = (budget: Budget) => {
    const percentage = (budget.remainingAmount / budget.amount) * 100;
    if (percentage < 20) return '#F44336';
    if (percentage < 50) return '#FFA726';
    return '#4CAF50';
  };

  const formatDate = (date: string) => new Date(date).toLocaleDateString('fr-FR');

  // Rendu des budgets
  const renderBudgets = () => {
    if (loading) return <Box sx={{ display: 'flex', justifyContent: 'center', p: 3 }}><CircularProgress sx={{ color: '#FF5733' }} /></Box>;
    if (error) return <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>;
    if (!budgets.length) return <Typography variant="body1" sx={{ textAlign: 'center', color: 'text.secondary', mt: 2 }}>Aucun budget pour le moment</Typography>;
    return (
      <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(400px, 1fr))', gap: 3 }}>
        {budgets.map((budget) => (
          <Paper key={budget.id} sx={{ p: 3, borderRadius: 2, boxShadow: '0px 2px 4px rgba(0,0,0,0.05)', display: 'flex', flexDirection: 'column', gap: 2 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
              <Typography variant="h6" sx={{ color: '#000', flex: 1 }}>{budget.name}</Typography>
              <Box sx={{ display: 'flex', gap: 1 }}>
                <IconButton onClick={() => handleOpenDeductDialog(budget)} sx={{ color: '#FF5733' }}><RemoveIcon /></IconButton>
                <IconButton onClick={() => handleEditBudget(budget)} sx={{ color: '#FF5733' }}><EditIcon /></IconButton>
                <IconButton onClick={() => handleDeleteBudget(budget.id)} sx={{ color: '#FF5733' }}><DeleteIcon /></IconButton>
              </Box>
            </Box>
            <Divider sx={{ my: 1 }} />
            <Box sx={{ mt: 1 }}>
              <Typography variant="subtitle1" sx={{ color: 'text.secondary' }}>Budget initial : {budget.amount.toLocaleString('fr-TN')} DT</Typography>
              <Typography variant="h5" sx={{ color: '#FF5733', fontWeight: 'bold', mt: 1 }}>Reste : {budget.remainingAmount.toLocaleString('fr-TN')} DT</Typography>
              <Box sx={{ mt: 2, mb: 1 }}>
                <LinearProgress variant="determinate" value={100 - ((budget.remainingAmount / budget.amount) * 100)} sx={{ height: 10, borderRadius: 5, backgroundColor: '#e0e0e0', '& .MuiLinearProgress-bar': { backgroundColor: getProgressColor(budget), borderRadius: 5 } }} />
              </Box>
            </Box>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <Typography variant="h5" sx={{ color: '#FF5733', fontWeight: 'bold' }}>{budget.amount}DT</Typography>
              <Chip label={budget.category} sx={{ bgcolor: '#FF5733', color: 'white' }} />
            </Box>
            <Box sx={{ mt: 2 }}>
              <Typography variant="body2" sx={{ color: 'text.secondary' }}>Période: {budget.period.toLowerCase()}</Typography>
              <Typography variant="body2" sx={{ color: 'text.secondary' }}>Date de début: {formatDate(budget.startDate)}</Typography>
              {budget.endDate && (<Typography variant="body2" sx={{ color: 'text.secondary' }}>Date de fin: {formatDate(budget.endDate)}</Typography>)}
            </Box>
            {budget.description && (<Typography variant="body2" sx={{ mt: 1 }}>{budget.description}</Typography>)}
            <Box sx={{ mt: 2 }}>
              <Typography variant="body2" sx={{ mb: 1, color: 'text.secondary' }}>Notifications: {budget.notifications.enabled ? 'Activées' : 'Désactivées'}{budget.notifications.enabled && ` (Seuil: ${budget.notifications.threshold}%)`}</Typography>
            </Box>
            {Array.isArray(budget.tags) && budget.tags.length > 0 && (
              <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap', mt: 1 }}>
                {budget.tags.map((tag) => (<Chip key={tag} label={tag} size="small" sx={{ bgcolor: '#FF5733', color: 'white' }} />))}
              </Box>
            )}
          </Paper>
        ))}
      </Box>
    );
  };

  // --- RENDER ---
  return (
    <Box sx={{ display: 'flex', minHeight: '100vh', bgcolor: '#F8F9FA' }}>
      <Sidebar />
      <Box component="main" sx={{ flexGrow: 1, ml: '280px' }}>
        <AppBar position="static" sx={{ 
          bgcolor: '#F0F3F4', 
          boxShadow: '0 1px 3px rgba(0, 0, 0, 0.05)',
          borderBottom: '2px solid rgba(200, 200, 200, 0.8)',
          borderRadius: 0
        }}>
          <Toolbar sx={{ minHeight: '64px !important' }} />
        </AppBar>
        <Box sx={{ p: 3 }}>
          <Typography variant="h4" sx={{ color: '#000', mb: 4, fontWeight: 500 }}>Budgets</Typography>
          <Box sx={{ display: 'flex', justifyContent: 'flex-end', mb: 4 }}>
            <Button variant="contained" startIcon={<AddIcon />} onClick={() => setOpenDialog(true)} sx={{ bgcolor: '#FF5733', '&:hover': { bgcolor: '#ff6b4a' } }}>Créer budget</Button>
          </Box>
          {renderBudgets()}
        </Box>
      </Box>
      {/* Dialog de création de budget */}
      <Dialog open={openDialog} onClose={() => { setOpenDialog(false); resetBudgetForm(); setShowExistingBudgetModal(false); }} maxWidth="sm" fullWidth>
        <DialogTitle>Créer un nouveau budget</DialogTitle>
        <DialogContent>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 2 }}>
            <TextField label="Nom du budget" fullWidth required value={newBudget.name} onChange={(e) => setNewBudget((prev) => ({ ...prev, name: e.target.value }))} />
            <TextField label="Montant (DT)" type="number" fullWidth required value={newBudget.amount} onChange={(e) => setNewBudget((prev) => ({ ...prev, amount: Number(e.target.value) }))} />
            <TextField select label="Catégorie" fullWidth required value={newBudget.category} onChange={(e) => setNewBudget((prev) => ({ ...prev, category: e.target.value }))} >
              {categories.map((category) => (<MenuItem key={category} value={category}>{category}</MenuItem>))}
            </TextField>
            <TextField select label="Période" fullWidth required value={newBudget.period} onChange={(e) => setNewBudget((prev) => ({ ...prev, period: e.target.value as Budget['period'] }))} >
              {periods.map((period) => (<MenuItem key={period.value} value={period.value}>{period.label}</MenuItem>))}
            </TextField>
            <TextField label="Date de début" type="date" fullWidth required InputLabelProps={{ shrink: true }} value={newBudget.startDate} onChange={(e) => setNewBudget((prev) => ({ ...prev, startDate: e.target.value }))} />
            <TextField label="Date de fin (optionnel)" type="date" fullWidth InputLabelProps={{ shrink: true }} value={newBudget.endDate} onChange={(e) => setNewBudget((prev) => ({ ...prev, endDate: e.target.value }))} />
            <TextField label="Description (optionnel)" fullWidth multiline rows={3} value={newBudget.description} onChange={(e) => setNewBudget((prev) => ({ ...prev, description: e.target.value }))} />
            <FormControlLabel control={<Switch checked={newBudget.notifications.enabled} onChange={(e) => setNewBudget((prev) => ({ ...prev, notifications: { ...prev.notifications, enabled: e.target.checked } }))} />} label="Notifications activées" />
            {newBudget.notifications.enabled && (
              <TextField label="Seuil de notification (%)" type="number" fullWidth value={newBudget.notifications.threshold} onChange={(e) => setNewBudget((prev) => ({ ...prev, notifications: { ...prev.notifications, threshold: Number(e.target.value) } }))} />
            )}
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <TextField label="Ajouter un tag" value={newTag} onChange={(e) => setNewTag(e.target.value)} onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); handleAddTag(); } }} />
              <Button onClick={handleAddTag} variant="outlined" sx={{ minWidth: 0, px: 2, bgcolor: '#FF5733', color: 'white', '&:hover': { bgcolor: '#ff6b4a' } }}>Ajouter</Button>
            </Box>
            <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap', mt: 1 }}>
              {newBudget.tags.map((tag) => (<Chip key={tag} label={tag} onDelete={() => handleRemoveTag(tag)} sx={{ bgcolor: '#FF5733', color: 'white' }} />))}
            </Box>
          </Box>
          {categoryExistsError && <Alert severity="error" sx={{ mt: 2, mb: 2 }}>{categoryExistsError}</Alert>}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => { setOpenDialog(false); resetBudgetForm(); }}>Annuler</Button>
          <Button onClick={handleAddBudget} variant="contained" sx={{ bgcolor: '#FF5733', color: 'white', '&:hover': { bgcolor: '#ff6b4a' } }}>Créer</Button>
        </DialogActions>
      </Dialog>
      {/* Existing Budget Alert Dialog */}
      <Dialog open={showExistingBudgetModal} onClose={() => setShowExistingBudgetModal(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Catégorie existante</DialogTitle>
        <DialogContent>
          <Typography variant="body1">
            {`Il existe déjà un budget actif pour la catégorie "${existingBudgetCategory}".`}
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setShowExistingBudgetModal(false)} color="primary">Fermer</Button>
        </DialogActions>
      </Dialog>
      {/* Dialog d'édition de budget */}
      <Dialog open={editDialogOpen} onClose={() => setEditDialogOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Modifier le budget</DialogTitle>
        <DialogContent>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 2 }}>
            <TextField label="Nom du budget" fullWidth required value={newBudget.name} onChange={(e) => setNewBudget((prev) => ({ ...prev, name: e.target.value }))} />
            <TextField label="Montant (DT)" type="number" fullWidth required value={newBudget.amount} onChange={(e) => setNewBudget((prev) => ({ ...prev, amount: Number(e.target.value) }))} />
            <TextField select label="Catégorie" fullWidth required value={newBudget.category} onChange={(e) => setNewBudget((prev) => ({ ...prev, category: e.target.value }))} >
              {categories.map((category) => (<MenuItem key={category} value={category}>{category}</MenuItem>))}
            </TextField>
            <TextField select label="Période" fullWidth required value={newBudget.period} onChange={(e) => setNewBudget((prev) => ({ ...prev, period: e.target.value as Budget['period'] }))} >
              {periods.map((period) => (<MenuItem key={period.value} value={period.value}>{period.label}</MenuItem>))}
            </TextField>
            <TextField label="Date de début" type="date" fullWidth required InputLabelProps={{ shrink: true }} value={newBudget.startDate} onChange={(e) => setNewBudget((prev) => ({ ...prev, startDate: e.target.value }))} />
            <TextField label="Date de fin (optionnel)" type="date" fullWidth InputLabelProps={{ shrink: true }} value={newBudget.endDate} onChange={(e) => setNewBudget((prev) => ({ ...prev, endDate: e.target.value }))} />
            <TextField label="Description (optionnel)" fullWidth multiline rows={3} value={newBudget.description} onChange={(e) => setNewBudget((prev) => ({ ...prev, description: e.target.value }))} />
            <FormControlLabel control={<Switch checked={newBudget.notifications.enabled} onChange={(e) => setNewBudget((prev) => ({ ...prev, notifications: { ...prev.notifications, enabled: e.target.checked } }))} />} label="Notifications activées" />
            {newBudget.notifications.enabled && (
              <TextField label="Seuil de notification (%)" type="number" fullWidth value={newBudget.notifications.threshold} onChange={(e) => setNewBudget((prev) => ({ ...prev, notifications: { ...prev.notifications, threshold: Number(e.target.value) } }))} />
            )}
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <TextField label="Ajouter un tag" value={newTag} onChange={(e) => setNewTag(e.target.value)} onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); handleAddTag(); } }} />
              <Button onClick={handleAddTag} variant="outlined" sx={{ minWidth: 0, px: 2, bgcolor: '#FF5733', color: 'white', '&:hover': { bgcolor: '#ff6b4a' } }}>Ajouter</Button>
            </Box>
            <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap', mt: 1 }}>
              {newBudget.tags.map((tag) => (<Chip key={tag} label={tag} onDelete={() => handleRemoveTag(tag)} sx={{ bgcolor: '#FF5733', color: 'white' }} />))}
            </Box>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => { setEditDialogOpen(false); resetBudgetForm(); }}>Annuler</Button>
          <Button onClick={handleUpdateBudget} variant="contained" sx={{ bgcolor: '#FF5733', color: 'white', '&:hover': { bgcolor: '#ff6b4a' } }}>Enregistrer</Button>
        </DialogActions>
      </Dialog>
      {/* Deduction Dialog */}
      <Dialog open={deductDialogOpen} onClose={handleCloseDeductDialog} maxWidth="xs" fullWidth>
        <DialogTitle>Déduire un montant</DialogTitle>
        <DialogContent>
          {showExceedWarning ? (
            <Box>
              <Alert severity="warning" sx={{ mb: 2 }}>
                {exceedWarningMessage}
              </Alert>
            </Box>
          ) : (
            <TextField
              label={`Montant à déduire (DT) (Max: ${selectedBudgetForDeduction?.remainingAmount.toLocaleString('fr-TN')})`}
              type="number"
              fullWidth
              value={deductionAmount}
              onChange={(e) => setDeductionAmount(Number(e.target.value))}
              sx={{ mt: 2 }}
              error={showExceedWarning}
              helperText={showExceedWarning ? 'Veuillez modifier le montant.' : ''}
            />
          )}
        </DialogContent>
        <DialogActions>
          {showExceedWarning ? (
            <Button onClick={handleChangeAmountClick} variant="contained" sx={{ bgcolor: '#FF5733', color: 'white', '&:hover': { bgcolor: '#ff6b4a' } }}>
              Changer le montant
            </Button>
          ) : (
            <>
              <Button onClick={handleCloseDeductDialog}>Annuler</Button>
              <Button onClick={handleDeductFromBudget} variant="contained" sx={{ bgcolor: '#FF5733', color: 'white', '&:hover': { bgcolor: '#ff6b4a' } }}>
                Déduire
              </Button>
            </>
          )}
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default BudgetsPage; 