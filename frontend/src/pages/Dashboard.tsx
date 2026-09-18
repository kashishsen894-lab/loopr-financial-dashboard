import React, { useEffect, useState, useCallback } from "react";
import {
  AppBar, Toolbar, Typography, Button, Container, Box, Alert, CircularProgress,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import api from "../api/axios";
import { useAuth } from "../context/AuthContext";
import { Transaction, Pagination, TransactionFilters } from "../types";
import Charts from "../components/Charts";
import FilterBar from "../components/FilterBar";
import TransactionTable from "../components/TransactionTable";
import ExportModal from "../components/ExportModal";

const Dashboard: React.FC = () => {
  const { logout } = useAuth();
  const navigate = useNavigate();

  const [filters, setFilters] = useState<TransactionFilters>({
    page: 1, limit: 10, sortBy: "date", sortOrder: "desc",
  });
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [pagination, setPagination] = useState<Pagination>({ page: 1, limit: 10, total: 0, totalPages: 0 });
  const [totals, setTotals] = useState<any[]>([]);
  const [monthly, setMonthly] = useState<any[]>([]);
  const [exportOpen, setExportOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchData = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const [txRes, summaryRes] = await Promise.all([
        api.get("/transactions", { params: filters }),
        api.get("/transactions/summary", { params: filters }),
      ]);
      setTransactions(txRes.data.data);
      setPagination(txRes.data.pagination);
      setTotals(summaryRes.data.totals);
      setMonthly(summaryRes.data.monthly);
    } catch (err: any) {
      setError(err.response?.data?.message || "Failed to load dashboard data");
    } finally {
      setLoading(false);
    }
  }, [filters]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <Box>
      <AppBar position="static" color="default" elevation={1}>
        <Toolbar>
          <Typography variant="h6" sx={{ flexGrow: 1 }}>
            Financial Analytics Dashboard
          </Typography>
          <Button variant="outlined" sx={{ mr: 1 }} onClick={() => setExportOpen(true)}>
            Export CSV
          </Button>
          <Button onClick={handleLogout}>Logout</Button>
        </Toolbar>
      </AppBar>

      <Container maxWidth="lg" sx={{ mt: 3, mb: 5 }}>
        {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

        <Charts totals={totals} monthly={monthly} />

        <FilterBar
          filters={filters}
          onChange={setFilters}
          onReset={() => setFilters({ page: 1, limit: 10, sortBy: "date", sortOrder: "desc" })}
        />

        {loading ? (
          <Box sx={{ display: "flex", justifyContent: "center", p: 5 }}><CircularProgress /></Box>
        ) : (
          <TransactionTable
            transactions={transactions}
            pagination={pagination}
            filters={filters}
            onChange={setFilters}
          />
        )}
      </Container>

      <ExportModal open={exportOpen} onClose={() => setExportOpen(false)} filters={filters} />
    </Box>
  );
};

export default Dashboard;