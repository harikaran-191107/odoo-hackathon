const Vehicle = require("../models/Vehicle");
const Driver = require("../models/Driver");
const Trip = require("../models/Trip");
const { asyncHandler } = require("../middleware/errorHandler");

// @route GET /api/dashboard
const getDashboardStats = asyncHandler(async (req, res) => {
  const [totalVehicles, availableVehicles, activeTrips, availableDrivers] = await Promise.all([
    Vehicle.countDocuments(),
    Vehicle.countDocuments({ status: "Available" }),
    Trip.countDocuments({ status: "Ongoing" }),
    Driver.countDocuments({ status: "Available" }),
  ]);

  res.json({ totalVehicles, availableVehicles, activeTrips, availableDrivers });
});

module.exports = { getDashboardStats };
