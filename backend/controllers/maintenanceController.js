const Maintenance = require("../models/Maintenance");
const Vehicle = require("../models/Vehicle");
const { asyncHandler } = require("../middleware/errorHandler");

// @route GET /api/maintenance
const getMaintenanceRecords = asyncHandler(async (req, res) => {
  const records = await Maintenance.find()
    .populate("vehicle", "registrationNumber name status")
    .sort({ createdAt: -1 });
  res.json(records);
});

// @route POST /api/maintenance
// @desc  Create maintenance record -> vehicle.status = "In Shop"
const createMaintenance = asyncHandler(async (req, res) => {
  const { vehicle: vehicleId, description, date } = req.body;

  if (!vehicleId || !description) {
    return res.status(400).json({ message: "vehicle and description are required" });
  }

  const vehicle = await Vehicle.findById(vehicleId);
  if (!vehicle) return res.status(404).json({ message: "Vehicle not found" });

  if (vehicle.status === "On Trip") {
    return res.status(400).json({
      message: "Cannot send a vehicle to maintenance while it is on a trip",
    });
  }

  const record = await Maintenance.create({
    vehicle: vehicleId,
    description,
    date: date || Date.now(),
    status: "Open",
  });

  vehicle.status = "In Shop";
  await vehicle.save();

  const populated = await record.populate("vehicle", "registrationNumber name status");
  res.status(201).json(populated);
});

// @route PUT /api/maintenance/:id/close
// @desc  Close maintenance record -> vehicle.status = "Available"
const closeMaintenance = asyncHandler(async (req, res) => {
  const record = await Maintenance.findById(req.params.id);
  if (!record) return res.status(404).json({ message: "Maintenance record not found" });

  if (record.status === "Closed") {
    return res.status(400).json({ message: "Maintenance record is already closed" });
  }

  record.status = "Closed";
  record.closedAt = new Date();
  await record.save();

  const vehicle = await Vehicle.findById(record.vehicle);
  if (vehicle && vehicle.status === "In Shop") {
    vehicle.status = "Available";
    await vehicle.save();
  }

  const populated = await record.populate("vehicle", "registrationNumber name status");
  res.json(populated);
});

// @route DELETE /api/maintenance/:id
const deleteMaintenance = asyncHandler(async (req, res) => {
  const record = await Maintenance.findById(req.params.id);
  if (!record) return res.status(404).json({ message: "Maintenance record not found" });

  await record.deleteOne();
  res.json({ message: "Maintenance record deleted successfully" });
});

module.exports = { getMaintenanceRecords, createMaintenance, closeMaintenance, deleteMaintenance };
