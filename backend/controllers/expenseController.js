const Expense = require("../models/Expense");
const { asyncHandler } = require("../middleware/errorHandler");

// @route GET /api/expenses
const getExpenses = asyncHandler(async (req, res) => {
  const expenses = await Expense.find().sort({ date: -1 });
  res.json(expenses);
});

// @route POST /api/expenses
const createExpense = asyncHandler(async (req, res) => {
  const { type, amount, date, notes } = req.body;

  if (!type || amount === undefined) {
    return res.status(400).json({ message: "type and amount are required" });
  }

  const expense = await Expense.create({ type, amount, date: date || Date.now(), notes });
  res.status(201).json(expense);
});

// @route DELETE /api/expenses/:id
const deleteExpense = asyncHandler(async (req, res) => {
  const expense = await Expense.findById(req.params.id);
  if (!expense) return res.status(404).json({ message: "Expense not found" });

  await expense.deleteOne();
  res.json({ message: "Expense deleted successfully" });
});

module.exports = { getExpenses, createExpense, deleteExpense };
