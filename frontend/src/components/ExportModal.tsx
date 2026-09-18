import React, { useState } from "react";
import {
  Dialog, DialogTitle, DialogContent, DialogActions, Button,
  FormGroup, FormControlLabel, Checkbox, Typography, Chip, Box, CircularProgress,
} from "@mui/material";
import api from "../api/axios";
import { TransactionFilters } from "../types";

interface Props {
  open: boolean;
  onClose: () => void;
  filters: TransactionFilters;
}

const ALL_COLUMNS = ["id", "date", "amount", "category", "status", "user_id", "user_profile"];
const LABELS: Record<string, string> = {
  id: "ID", date: "Date", amount: "Amount", category: "Category",
  status: "Status", user_id: "User ID", user_profile: "User Profile URL",
};

const ExportModal: React.FC<Props> = ({ open, onClose, filters }) => {
  const [selected, setSelected] = useState<string[]>(ALL_COLUMNS.slice(0, 5));
  const [downloading, setDownloading] = useState(false);

  const toggle = (col: string) => {
    setSelected((prev) => (prev.includes(col) ? prev.filter((c) => c !== col) : [...prev, col]));
  };

  const handleExport = async () => {
    setDownloading(true);
    try {
      const params: any = { ...filters, columns: selected.join(",") };
      delete params.page;
      delete params.limit;
      const res = await api.get("/transactions/export", { params, responseType: "blob" });
      const url = window.URL.createObjectURL(new Blob([res.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", "transactions_export.csv");
      document.body.appendChild(link);
      link.click();
      link.remove();
      onClose();
    } catch (err) {
      console.error(err);
    } finally {
      setDownloading(false);
    }
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>Configure CSV Export</DialogTitle>
      <DialogContent>
        <Typography variant="body2" sx={{ color: "text.secondary", mb: 2 }}>
          Choose which columns to include. Current filters will be applied to the export.
        </Typography>
        <FormGroup>
          {ALL_COLUMNS.map((col) => (
            <FormControlLabel
              key={col}
              control={<Checkbox checked={selected.includes(col)} onChange={() => toggle(col)} />}
              label={LABELS[col] || col}
            />
          ))}
        </FormGroup>
        {selected.length > 0 && (
          <Box sx={{ mt: 2 }}>
            <Typography variant="subtitle2" sx={{ mb: 1 }}>Selected Columns</Typography>
            <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1 }}>
              {selected.map((col) => (
                <Chip key={col} label={LABELS[col] || col} onDelete={() => toggle(col)} color="primary" variant="outlined" />
              ))}
            </Box>
          </Box>
        )}
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button
          variant="contained"
          disabled={selected.length === 0 || downloading}
          onClick={handleExport}
          startIcon={downloading ? <CircularProgress size={16} color="inherit" /> : undefined}
        >
          {downloading ? "Preparing..." : "Export CSV"}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ExportModal;