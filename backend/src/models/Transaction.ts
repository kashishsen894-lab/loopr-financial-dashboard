import mongoose, { Schema, Document } from "mongoose";

export interface ITransaction extends Document {
  id: number;
  date: Date;
  amount: number;
  category: "Revenue" | "Expense";
  status: "Paid" | "Pending";
  user_id: string;
  user_profile: string;
}

const TransactionSchema = new Schema<ITransaction>({
  id: { type: Number, required: true, unique: true, index: true },
  date: { type: Date, required: true, index: true },
  amount: { type: Number, required: true },
  category: { type: String, enum: ["Revenue", "Expense"], required: true, index: true },
  status: { type: String, enum: ["Paid", "Pending"], required: true, index: true },
  user_id: { type: String, required: true, index: true },
  user_profile: { type: String, required: true },
});

export default mongoose.model<ITransaction>("Transaction", TransactionSchema);