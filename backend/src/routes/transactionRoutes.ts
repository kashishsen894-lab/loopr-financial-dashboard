import { Router } from "express";
import { authenticate } from "../middleware/auth";
import { getTransactions, getSummary, exportCSV } from "../controllers/transactionController";

const router = Router();

router.use(authenticate);
router.get("/", getTransactions);
router.get("/summary", getSummary);
router.get("/export", exportCSV);

export default router;