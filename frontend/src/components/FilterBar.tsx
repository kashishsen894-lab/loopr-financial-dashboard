import React from "react";
import { Paper, Grid, TextField, MenuItem, Button } from "@mui/material";
import { TransactionFilters } from "../types";

interface Props {
  filters: TransactionFilters;
  onChange: (filters: TransactionFilters) => void;
  onReset: () => void;
}

const FilterBar: React.FC<Props> = ({ filters, onChange, onReset }) => {
  const update = (key: keyof TransactionFilters, value: any) => {
    onChange({ ...filters, [key]: value || undefined, page: 1 });
  };

  return (
    <Paper sx={{ p: 2, mb: 2 }}>
     <Grid container spacing={2} sx={{ alignItems: "center" }}>
        <Grid size={{ xs: 12, sm: 3 }}>
          <TextField
            fullWidth
            size="small"
            label="Search"
            placeholder="category, status, user..."
            value={filters.search || ""}
            onChange={(e) => update("search", e.target.value)}
          />
        </Grid>
        <Grid size={{ xs: 6, sm: 2 }}>
          <TextField select fullWidth size="small" label="Category" value={filters.category || ""} onChange={(e) => update("category", e.target.value)}>
            <MenuItem value="">All</MenuItem>
            <MenuItem value="Revenue">Revenue</MenuItem>
            <MenuItem value="Expense">Expense</MenuItem>
          </TextField>
        </Grid>
        <Grid size={{ xs: 6, sm: 2 }}>
          <TextField select fullWidth size="small" label="Status" value={filters.status || ""} onChange={(e) => update("status", e.target.value)}>
            <MenuItem value="">All</MenuItem>
            <MenuItem value="Paid">Paid</MenuItem>
            <MenuItem value="Pending">Pending</MenuItem>
          </TextField>
        </Grid>
        <Grid size={{ xs: 6, sm: 2 }}>
          <TextField fullWidth size="small" type="date" label="Start Date" slotProps={{ inputLabel: { shrink: true } }} value={filters.startDate || ""} onChange={(e) => update("startDate", e.target.value)} />
        </Grid>
        <Grid size={{ xs: 6, sm: 2 }}>
          <TextField fullWidth size="small" type="date" label="End Date" slotProps={{ inputLabel: { shrink: true } }} value={filters.endDate || ""} onChange={(e) => update("endDate", e.target.value)} />
        </Grid>
        <Grid size={{ xs: 12, sm: 1 }}>
          <Button fullWidth onClick={onReset}>Reset</Button>
        </Grid>
      </Grid>
    </Paper>
  );
};

export default FilterBar;