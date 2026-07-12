const Driver = require("../models/Driver");
const { asyncHandler } = require("../middleware/errorHandler");

// @route GET /api/drivers
const getDrivers = asyncHandler(async (req, res) => {
  const drivers = await Driver.find().sort({ createdAt: -1 });
  res.json(drivers);
});

// @route GET /api/drivers/:id
const getDriver = asyncHandler(async (req, res) => {
  const driver = await Driver.findById(req.params.id);
  if (!driver) return res.status(404).json({ message: "Driver not found" });
  res.json(driver);
});

// @route POST /api/drivers
const createDriver = asyncHandler(async (req, res) => {
  const { name, licenseNumber, licenseExpiry, status } = req.body;

  if (!name || !licenseNumber || !licenseExpiry) {
    return res.status(400).json({
      message: "name, licenseNumber and licenseExpiry are required",
    });
  }

  const driver = await Driver.create({ name, licenseNumber, licenseExpiry, status });
  res.status(201).json(driver);
});

// @route PUT /api/drivers/:id
const updateDriver = asyncHandler(async (req, res) => {
  const driver = await Driver.findById(req.params.id);
  if (!driver) return res.status(404).json({ message: "Driver not found" });

  const { name, licenseNumber, licenseExpiry, status } = req.body;

  if (name !== undefined) driver.name = name;
  if (licenseNumber !== undefined) driver.licenseNumber = licenseNumber;
  if (licenseExpiry !== undefined) driver.licenseExpiry = licenseExpiry;
  if (status !== undefined) driver.status = status;

  const updated = await driver.save();
  res.json(updated);
});

// @route DELETE /api/drivers/:id
const deleteDriver = asyncHandler(async (req, res) => {
  const driver = await Driver.findById(req.params.id);
  if (!driver) return res.status(404).json({ message: "Driver not found" });

  await driver.deleteOne();
  res.json({ message: "Driver deleted successfully" });
});

module.exports = { getDrivers, getDriver, createDriver, updateDriver, deleteDriver };
