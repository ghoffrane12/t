import React from 'react';
import {
  Box,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  TablePagination,
} from '@mui/material';

interface Transaction {
  id: number;
  categorie: string;
  date: string;
  montant: string;
}

// Sample data - replace with real data from your backend
const transactions: Transaction[] = [
  { id: 1, categorie: 'Courses', date: '12.01.2025', montant: '-98.200 DT' },
  { id: 2, categorie: 'Divertissement', date: '12.01.2025', montant: '-98.200 DT' },
  { id: 3, categorie: 'Transport', date: '12.01.2025', montant: '-98.200 DT' },
  { id: 4, categorie: 'Éducation', date: '12.01.2025', montant: '-98.200 DT' },
];

const TransactionHistory = () => {
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(5);

  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  return (
    <Box sx={{ p: 3, bgcolor: 'white', borderRadius: 2, boxShadow: 1 }}>
      <Typography variant="h6" sx={{ mb: 2 }}>
        Historique de transactions
      </Typography>
      <TableContainer component={Paper} sx={{ boxShadow: 'none' }}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Catégories</TableCell>
              <TableCell>Date</TableCell>
              <TableCell align="right">Montant</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {transactions
              .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
              .map((transaction) => (
                <TableRow key={transaction.id}>
                  <TableCell>{transaction.categorie}</TableCell>
                  <TableCell>{transaction.date}</TableCell>
                  <TableCell 
                    align="right"
                    sx={{ 
                      color: transaction.montant.startsWith('-') ? '#FF5733' : '#4CAF50',
                      fontWeight: 'bold'
                    }}
                  >
                    {transaction.montant}
                  </TableCell>
                </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      <TablePagination
        component="div"
        count={transactions.length}
        page={page}
        onPageChange={handleChangePage}
        rowsPerPage={rowsPerPage}
        onRowsPerPageChange={handleChangeRowsPerPage}
        labelRowsPerPage="Lignes par page"
      />
    </Box>
  );
};

export default TransactionHistory; 