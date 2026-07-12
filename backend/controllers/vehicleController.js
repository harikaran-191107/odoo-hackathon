const Vehicle = require("../models/Vehicle");
const { asyncHandler } = require("../middleware/errorHandler");

// @route GET /api/vehicles
const getVehicles = asyncHandler(async (req, res) => {
  const vehicles = await Vehicle.find().sort({ createdAt: -1 });
  res.json(vehicles);
});

// @route GET /api/vehicles/:id
const getVehicle = asyncHandler(async (req, res) => {
  const vehicle = await Vehicle.findById(req.params.id);
  if (!vehicle) return res.status(404).json({ message: "Vehicle not found" });
  res.json(vehicle);
});

// @route POST /api/vehicles
const createVehicle = asyncHandler(async (req, res) => {
  const { registrationNumber, name, type, capacity, status } = req.body;

  if (!registrationNumber || !name || !type || capacity === undefined) {
    return res.status(400).json({
      message: "registrationNumber, name, type and capacity are required",
    });
  }

  const vehicle = await Vehicle.create({
    registrationNumber,
    name,
    type,
    capacity,
    status,
  });

  res.status(201).json(vehicle);
});

// @route PUT /api/vehicles/:id
const updateVehicle = asyncHandler(async (req, res) => {
  const vehicle = await Vehicle.findById(req.params.id);
  if (!vehicle) return res.status(404).json({ message: "Vehicle not found" });

  const { registrationNumber, name, type, capacity, status } = req.body;

  if (registrationNumber !== undefined) vehicle.registrationNumber = registrationNumber;
  if (name !== undefined) vehicle.name = name;
  if (type !== undefined) vehicle.type = type;
  if (capacity !== undefined) vehicle.capacity = capacity;
  if (status !== undefined) vehicle.status = status;

  const updated = await vehicle.save();
  res.json(updated);
});

// @route DELETE /api/vehicles/:id
const deleteVehicle = asyncHandler(async (req, res) => {
  const vehicle = await Vehicle.findById(req.params.id);
  if (!vehicle) return res.status(404).json({ message: "Vehicle not found" });

  await vehicle.deleteOne();
  res.json({ message: "Vehicle deleted successfully" });
});

module.exports = { getVehicles, getVehicle, createVehicle, updateVehicle, deleteVehicle };
