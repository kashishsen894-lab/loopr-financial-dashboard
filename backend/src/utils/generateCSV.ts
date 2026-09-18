import { ITransaction } from "../models/Transaction";

const ALL_COLUMNS: Record<string, (t: ITransaction) => string> = {
  id: (t) => String(t.id),
  date: (t) => new Date(t.date).toISOString(),
  amount: (t) => t.amount.toFixed(2),
  category: (t) => t.category,
  status: (t) => t.status,
  user_id: (t) => t.user_id,
  user_profile: (t) => t.user_profile,
};

const escapeCSV = (value: string): string => {
  if (value.includes(",") || value.includes('"') || value.includes("\n")) {
    return `"${value.replace(/"/g, '""')}"`;
  }
  return value;
};

export const generateCSV = (transactions: ITransaction[], columns?: string[]): string => {
  const cols = columns && columns.length > 0 ? columns.filter((c) => c in ALL_COLUMNS) : Object.keys(ALL_COLUMNS);
  const header = cols.join(",");
  const rows = transactions.map((t) => cols.map((c) => escapeCSV(ALL_COLUMNS[c](t))).join(","));
  return [header, ...rows].join("\n");
};

export const AVAILABLE_COLUMNS = Object.keys(ALL_COLUMNS);