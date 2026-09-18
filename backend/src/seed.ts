import dotenv from "dotenv";
import { connectDB } from "./config/db";
import Transaction from "./models/Transaction";
import User from "./models/User";
import rawData from "./data/transactions.json";
import mongoose from "mongoose";

dotenv.config();

const run = async () => {
  await connectDB();

  console.log("Clearing existing transactions...");
  await Transaction.deleteMany({});

  console.log(`Inserting ${rawData.length} transactions...`);
  await Transaction.insertMany(
    rawData.map((t: any) => ({ ...t, date: new Date(t.date) }))
  );

  const demoEmail = "analyst@loopr.ai";
  const existing = await User.findOne({ email: demoEmail });
  if (!existing) {
    console.log("Creating demo user (analyst@loopr.ai / password123)...");
    await User.create({ email: demoEmail, password: "password123", name: "Demo User" });
  } else {
    console.log("Demo user already exists, skipping.");
  }

  console.log("Seed complete.");
  await mongoose.disconnect();
  process.exit(0);
};

run().catch((err) => {
  console.error("Seed failed:", err);
  process.exit(1);
});