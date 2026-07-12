const express = require("express");
const router = express.Router();
const { getFuelLogs, createFuelLog, deleteFuelLog } = require("../controllers/fuelController");
const { protect } = require("../middleware/auth");

router.use(protect);

router.route("/").get(getFuelLogs).post(createFuelLog);
router.delete("/:id", deleteFuelLog);

module.exports = router;
