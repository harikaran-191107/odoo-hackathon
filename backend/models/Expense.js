const mongoose = require("mongoose");

const expenseSchema = new mongoose.Schema(
  {
    type: { type: String, enum: ["Toll", "Repair", "Other"], required: true },
    amount: { type: Number, required: true, min: 0 },
    date: { type: Date, required: true, default: Date.now },
    notes: { type: String, trim: true },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Expense", expenseSchema);
