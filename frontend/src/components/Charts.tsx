import React from "react";
import { Paper, Grid, Typography, Box } from "@mui/material";
import {
  ResponsiveContainer, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend,
  PieChart, Pie, Cell,
} from "recharts";

interface Totals {
  _id: string;
  total: number;
  count: number;
}

interface Monthly {
  _id: { year: number; month: number; category: string };
  total: number;
}

const COLORS: Record<string, string> = { Revenue: "#2e7d32", Expense: "#c62828" };
const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

const Charts: React.FC<{ totals: Totals[]; monthly: Monthly[] }> = ({ totals, monthly }) => {
  const lineDataMap: Record<string, any> = {};
  monthly.forEach((m) => {
    const key = `${m._id.year}-${m._id.month}`;
    if (!lineDataMap[key]) {
      lineDataMap[key] = { label: `${monthNames[m._id.month - 1]} ${m._id.year}`, Revenue: 0, Expense: 0 };
    }
    lineDataMap[key][m._id.category] = m.total;
  });
  const lineData = Object.values(lineDataMap);
  const pieData = totals.map((t) => ({ name: t._id, value: t.total }));
  const revenueTotal = totals.find((t) => t._id === "Revenue")?.total || 0;
  const expenseTotal = totals.find((t) => t._id === "Expense")?.total || 0;

  return (
    <Grid container spacing={2} sx={{ mb: 2 }}>
      <Grid size={{ xs: 12, md: 4 }}>
        <Paper sx={{ p: 2, height: "100%" }}>
          <Typography variant="subtitle2" sx={{ color: "text.secondary" }}>Total Revenue</Typography>
          <Typography variant="h5" sx={{ color: "success.main", fontWeight: 700 }}>
            ${revenueTotal.toLocaleString()}
          </Typography>
          <Typography variant="subtitle2" sx={{ color: "text.secondary", mt: 2 }}>Total Expense</Typography>
          <Typography variant="h5" sx={{ color: "error.main", fontWeight: 700 }}>
            ${expenseTotal.toLocaleString()}
          </Typography>
          <Box sx={{ mt: 2 }}>
            <ResponsiveContainer width="100%" height={150}>
              <PieChart>
                <Pie data={pieData} dataKey="value" nameKey="name" innerRadius={35} outerRadius={60}>
                  {pieData.map((entry) => (
                    <Cell key={entry.name} fill={COLORS[entry.name] || "#888"} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </Box>
        </Paper>
      </Grid>
      <Grid size={{ xs: 12, md: 8 }}>
        <Paper sx={{ p: 2, height: "100%" }}>
          <Typography variant="subtitle2" sx={{ color: "text.secondary", mb: 1 }}>
            Revenue vs Expense Trend
          </Typography>
          <ResponsiveContainer width="100%" height={280}>
            <LineChart data={lineData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="label" fontSize={12} />
              <YAxis fontSize={12} />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="Revenue" stroke={COLORS.Revenue} strokeWidth={2} />
              <Line type="monotone" dataKey="Expense" stroke={COLORS.Expense} strokeWidth={2} />
            </LineChart>
          </ResponsiveContainer>
        </Paper>
      </Grid>
    </Grid>
  );
};

export default Charts;