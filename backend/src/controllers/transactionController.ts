import { Response } from "express";
import Transaction from "../models/Transaction";
import { AuthRequest } from "../middleware/auth";
import { generateCSV, AVAILABLE_COLUMNS } from "../utils/generateCSV";

const buildFilter = (query: any) => {
  const filter: any = {};
  if (query.category) filter.category = query.category;
  if (query.status) filter.status = query.status;
  if (query.user_id) filter.user_id = query.user_id;
  if (query.startDate || query.endDate) {
    filter.date = {};
    if (query.startDate) filter.date.$gte = new Date(query.startDate);
    if (query.endDate) filter.date.$lte = new Date(query.endDate);
  }
  if (query.search) {
    const regex = new RegExp(String(query.search), "i");
    filter.$or = [{ category: regex }, { status: regex }, { user_id: regex }];
  }
  return filter;
};

export const getTransactions = async (req: AuthRequest, res: Response) => {
  try {
    const { page = "1", limit = "10", sortBy = "date", sortOrder = "desc" } = req.query;
    const filter = buildFilter(req.query);
    const pageNum = Math.max(1, parseInt(page as string, 10));
    const limitNum = Math.max(1, parseInt(limit as string, 10));
    const sortDir = sortOrder === "asc" ? 1 : -1;

    const [items, total] = await Promise.all([
      Transaction.find(filter)
        .sort({ [sortBy as string]: sortDir })
        .skip((pageNum - 1) * limitNum)
        .limit(limitNum),
      Transaction.countDocuments(filter),
    ]);

    return res.json({
      data: items,
      pagination: { page: pageNum, limit: limitNum, total, totalPages: Math.ceil(total / limitNum) },
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Server error fetching transactions" });
  }
};
export const getSummary = async (req: AuthRequest, res: Response) => {
  try {
    const filter = buildFilter(req.query);

    const totals = await Transaction.aggregate([
      { $match: filter },
      { $group: { _id: "$category", total: { $sum: "$amount" }, count: { $sum: 1 } } },
    ]);

    const monthly = await Transaction.aggregate([
      { $match: filter },
      {
        $group: {
          _id: { year: { $year: "$date" }, month: { $month: "$date" }, category: "$category" },
          total: { $sum: "$amount" },
        },
      },
      { $sort: { "_id.year": 1, "_id.month": 1 } },
    ]);

    return res.json({ totals, monthly });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Server error fetching summary" });
  }
};
export const exportCSV = async (req: AuthRequest, res: Response) => {
  try {
    const filter = buildFilter(req.query);
    const columnsParam = req.query.columns as string | undefined;
    const columns = columnsParam ? columnsParam.split(",") : AVAILABLE_COLUMNS;

    const transactions = await Transaction.find(filter).sort({ date: -1 });
    const csv = generateCSV(transactions, columns);

    res.setHeader("Content-Type", "text/csv");
    res.setHeader("Content-Disposition", "attachment; filename=transactions_export.csv");
    return res.status(200).send(csv);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Server error generating CSV" });
  }
};