import React from "react";
import {
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
  Paper, Chip, TablePagination,
} from "@mui/material";
import { Transaction, Pagination, TransactionFilters } from "../types";

interface Props {
  transactions: Transaction[];
  pagination: Pagination;
  filters: TransactionFilters;
  onChange: (filters: TransactionFilters) => void;
}

const TransactionTable: React.FC<Props> = ({ transactions, pagination, filters, onChange }) => {
  return (
    <Paper>
      <TableContainer>
        <Table size="small">
          <TableHead>
            <TableRow>
              <TableCell>ID</TableCell>
              <TableCell>Date</TableCell>
              <TableCell>Amount</TableCell>
              <TableCell>Category</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>User</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {transactions.map((t) => (
              <TableRow key={t.id} hover>
                <TableCell>{t.id}</TableCell>
                <TableCell>{new Date(t.date).toLocaleDateString()}</TableCell>
                <TableCell>${t.amount.toFixed(2)}</TableCell>
                <TableCell>
                  <Chip size="small" label={t.category} color={t.category === "Revenue" ? "success" : "error"} variant="outlined" />
                </TableCell>
                <TableCell>
                  <Chip size="small" label={t.status} color={t.status === "Paid" ? "primary" : "warning"} />
                </TableCell>
                <TableCell>{t.user_id}</TableCell>
              </TableRow>
            ))}
            {transactions.length === 0 && (
              <TableRow>
                <TableCell colSpan={6} align="center">No transactions found</TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>
      <TablePagination
        component="div"
        count={pagination.total}
        page={pagination.page - 1}
        rowsPerPage={pagination.limit}
        rowsPerPageOptions={[10, 25, 50]}
        onPageChange={(_e, newPage) => onChange({ ...filters, page: newPage + 1 })}
        onRowsPerPageChange={(e) => onChange({ ...filters, limit: parseInt(e.target.value, 10), page: 1 })}
      />
    </Paper>
  );
};

export default TransactionTable;