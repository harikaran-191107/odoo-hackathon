const FuelLog = require("../models/FuelLog");
const Vehicle = require("../models/Vehicle");
const { asyncHandler } = require("../middleware/errorHandler");

// @route GET /api/fuel
const getFuelLogs = asyncHandler(async (req, res) => {
  const logs = await FuelLog.find()
    .populate("vehicle", "registrationNumber name")
    .sort({ date: -1 });
  res.json(logs);
});

// @route POST /api/fuel
const createFuelLog = asyncHandler(async (req, res) => {
  const { vehicle: vehicleId, liters, cost, date } = req.body;

  if (!vehicleId || liters === undefined || cost === undefined) {
    return res.status(400).json({ message: "vehicle, liters and cost are required" });
  }

  const vehicle = await Vehicle.findById(vehicleId);
  if (!vehicle) return res.status(404).json({ message: "Vehicle not found" });

  const log = await FuelLog.create({ vehicle: vehicleId, liters, cost, date: date || Date.now() });
  const populated = await log.populate("vehicle", "registrationNumber name");
  res.status(201).json(populated);
});

// @route DELETE /api/fuel/:id
const deleteFuelLog = asyncHandler(async (req, res) => {
  const log = await FuelLog.findById(req.params.id);
  if (!log) return res.status(404).json({ message: "Fuel log not found" });

  await log.deleteOne();
  res.json({ message: "Fuel log deleted successfully" });
});

module.exports = { getFuelLogs, createFuelLog, deleteFuelLog };
