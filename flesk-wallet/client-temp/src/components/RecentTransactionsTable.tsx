import React from 'react';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Chip, Avatar, Typography } from '@mui/material';
import { Category, DirectionsCar, School, Movie, CardGiftcard, PhoneAndroid, Work, SportsEsports, LocalHospital, Receipt, Fastfood, MonetizationOn, ArrowDownward, ArrowUpward } from '@mui/icons-material';

const iconMap: Record<string, React.ReactNode> = {
  'Divertissement': <Movie />,
  'Téléphonie': <PhoneAndroid />,
  'Freelance': <Work />,
  'Loisirs': <SportsEsports />,
  'Éducation': <School />,
  'Transport': <DirectionsCar />,
  'Factures': <Receipt />,
  'Alimentation': <Fastfood />,
  'Santé': <LocalHospital />,
  'Remboursement': <ArrowDownward />,
  'Salaire': <MonetizationOn />,
  // Ajoute d'autres catégories/icônes ici
};

const colorMap: Record<string, string> = {
  'Divertissement': '#ea4d7c',
  'Téléphonie': '#4285f4',
  'Freelance': '#34a853',
  'Loisirs': '#fbbc05',
  'Éducation': '#6c63ff',
  'Transport': '#1cc6e7',
  'Factures': '#2ed573',
  'Alimentation': '#43d672',
  'Santé': '#ff4757',
  'Remboursement': '#a259e6',
  'Salaire': '#4CAF50',
  // Ajoute d'autres catégories/couleurs ici
};

const typeColor: Record<'revenu' | 'dépense', "success" | "error"> = {
  revenu: 'success',
  dépense: 'error'
};

export interface Transaction {
  id: string;
  category: string;
  date: string;
  description: string;
  amount: number;
  currency: string;
  type: 'revenu' | 'dépense';
}

const RecentTransactionsTable: React.FC<{ transactions: Transaction[] }> = ({ transactions }) => (
  <Paper sx={{ p: 3, borderRadius: 3 }}>
    <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
      Historique des transactions
    </Typography>
    <TableContainer>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Catégorie</TableCell>
            <TableCell>Date</TableCell>
            <TableCell>Description</TableCell>
            <TableCell align="right">Montant</TableCell>
            <TableCell>Devise</TableCell>
            <TableCell>Type</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {transactions.map((t) => (
            <TableRow key={t.id}>
              <TableCell>
                <Avatar sx={{ bgcolor: colorMap[t.category] || '#e0e0e0', mr: 1, width: 32, height: 32, display: 'inline-flex' }}>
                  {iconMap[t.category] || <Category />}
                </Avatar>
                {t.category}
              </TableCell>
              <TableCell>{t.date}</TableCell>
              <TableCell>{t.description}</TableCell>
              <TableCell align="right" sx={{ color: t.type === 'revenu' ? 'green' : 'red', fontWeight: 600 }}>
                {t.amount.toFixed(2)}
              </TableCell>
              <TableCell>{t.currency}</TableCell>
              <TableCell>
                <Chip
                  label={t.type === 'revenu' ? 'Revenu' : 'Dépense'}
                  color={typeColor[t.type]}
                  size="small"
                  sx={{ fontWeight: 600 }}
                />
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  </Paper>
);

export default RecentTransactionsTable; 