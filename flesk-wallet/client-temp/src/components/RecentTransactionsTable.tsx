import React from 'react';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Chip, Avatar, Typography } from '@mui/material';
import { getCategoryIcon, getCategoryColor } from '../utils/categoryIcons';
import { ArrowDownward, ArrowUpward } from '@mui/icons-material';

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
          {transactions.map((t) => {
            const CategoryIcon = getCategoryIcon(t.category);
            const categoryBgColor = getCategoryColor(t.category);
            return (
              <TableRow key={t.id}>
                <TableCell>
                  <Avatar sx={{ bgcolor: categoryBgColor, mr: 1, width: 32, height: 32, display: 'inline-flex' }}>
                    <CategoryIcon />
                  </Avatar>
                  {t.category}
                </TableCell>
                <TableCell>{t.date}</TableCell>
                <TableCell>{t.description}</TableCell>
                <TableCell align="right" sx={{ color: t.type === 'revenu' ? 'green' : 'red', fontWeight: 600 }}>
                  {t.amount.toFixed(2)}
                </TableCell>
                <TableCell>
                  {t.currency}
                </TableCell>
                <TableCell>
                  <Chip
                    label={t.type === 'revenu' ? 'Revenu' : 'Dépense'}
                    color={typeColor[t.type]}
                    size="small"
                    sx={{ fontWeight: 600 }}
                  />
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </TableContainer>
  </Paper>
);

export default RecentTransactionsTable; 