const mongoose = require("mongoose");
const Trip = require("../models/Trip");
const Vehicle = require("../models/Vehicle");
const Driver = require("../models/Driver");
const { asyncHandler } = require("../middleware/errorHandler");

// @route GET /api/trips
const getTrips = asyncHandler(async (req, res) => {
  const trips = await Trip.find()
    .populate("vehicle", "registrationNumber name capacity status")
    .populate("driver", "name licenseNumber status")
    .sort({ createdAt: -1 });
  res.json(trips);
});

// @route GET /api/trips/:id
const getTrip = asyncHandler(async (req, res) => {
  const trip = await Trip.findById(req.params.id)
    .populate("vehicle", "registrationNumber name capacity status")
    .populate("driver", "name licenseNumber status");
  if (!trip) return res.status(404).json({ message: "Trip not found" });
  res.json(trip);
});

// @route POST /api/trips
// @desc  Create a trip. Enforces:
//        - vehicle must be Available
//        - driver must be Available
//        - cargoWeight <= vehicle.capacity
//        On success: vehicle -> "On Trip", driver -> "On Trip"
const createTrip = asyncHandler(async (req, res) => {
  const { source, destination, cargoWeight, vehicle: vehicleId, driver: driverId } = req.body;

  if (!source || !destination || cargoWeight === undefined || !vehicleId || !driverId) {
    return res.status(400).json({
      message: "source, destination, cargoWeight, vehicle and driver are required",
    });
  }

  const vehicle = await Vehicle.findById(vehicleId);
  if (!vehicle) return res.status(404).json({ message: "Vehicle not found" });

  const driver = await Driver.findById(driverId);
  if (!driver) return res.status(404).json({ message: "Driver not found" });

  if (vehicle.status !== "Available") {
    return res.status(400).json({
      message: `Vehicle is not available for a trip (current status: ${vehicle.status})`,
    });
  }

  if (driver.status !== "Available") {
    return res.status(400).json({
      message: `Driver is not available for a trip (current status: ${driver.status})`,
    });
  }

  if (Number(cargoWeight) > vehicle.capacity) {
    return res.status(400).json({
      message: `Cargo weight (${cargoWeight}) exceeds vehicle capacity (${vehicle.capacity})`,
    });
  }

  const trip = await Trip.create({
    source,
    destination,
    cargoWeight,
    vehicle: vehicleId,
    driver: driverId,
    status: "Ongoing",
  });

  vehicle.status = "On Trip";
  driver.status = "On Trip";
  await vehicle.save();
  await driver.save();

  const populated = await trip.populate([
    { path: "vehicle", select: "registrationNumber name capacity status" },
    { path: "driver", select: "name licenseNumber status" },
  ]);

  res.status(201).json(populated);
});

// @route PUT /api/trips/:id/complete
// @desc  Mark trip Completed, free up vehicle and driver
const completeTrip = asyncHandler(async (req, res) => {
  const trip = await Trip.findById(req.params.id);
  if (!trip) return res.status(404).json({ message: "Trip not found" });

  if (trip.status === "Completed") {
    return res.status(400).json({ message: "Trip is already completed" });
  }
  if (trip.status === "Cancelled") {
    return res.status(400).json({ message: "Cannot complete a cancelled trip" });
  }

  trip.status = "Completed";
  trip.completedAt = new Date();
  await trip.save();

  const vehicle = await Vehicle.findById(trip.vehicle);
  if (vehicle && vehicle.status === "On Trip") {
    vehicle.status = "Available";
    await vehicle.save();
  }

  const driver = await Driver.findById(trip.driver);
  if (driver && driver.status === "On Trip") {
    driver.status = "Available";
    await driver.save();
  }

  const populated = await trip.populate([
    { path: "vehicle", select: "registrationNumber name capacity status" },
    { path: "driver", select: "name licenseNumber status" },
  ]);

  res.json(populated);
});

// @route PUT /api/trips/:id/cancel
// @desc  Cancel an ongoing trip, free up vehicle and driver
const cancelTrip = asyncHandler(async (req, res) => {
  const trip = await Trip.findById(req.params.id);
  if (!trip) return res.status(404).json({ message: "Trip not found" });

  if (trip.status !== "Ongoing") {
    return res.status(400).json({ message: "Only ongoing trips can be cancelled" });
  }

  trip.status = "Cancelled";
  await trip.save();

  const vehicle = await Vehicle.findById(trip.vehicle);
  if (vehicle && vehicle.status === "On Trip") {
    vehicle.status = "Available";
    await vehicle.save();
  }

  const driver = await Driver.findById(trip.driver);
  if (driver && driver.status === "On Trip") {
    driver.status = "Available";
    await driver.save();
  }

  res.json(trip);
});

// @route DELETE /api/trips/:id
const deleteTrip = asyncHandler(async (req, res) => {
  const trip = await Trip.findById(req.params.id);
  if (!trip) return res.status(404).json({ message: "Trip not found" });

  await trip.deleteOne();
  res.json({ message: "Trip deleted successfully" });
});

module.exports = { getTrips, getTrip, createTrip, completeTrip, cancelTrip, deleteTrip };
