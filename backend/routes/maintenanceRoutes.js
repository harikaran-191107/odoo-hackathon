const express = require("express");
const router = express.Router();
const {
  getMaintenanceRecords,
  createMaintenance,
  closeMaintenance,
  deleteMaintenance,
} = require("../controllers/maintenanceController");
const { protect } = require("../middleware/auth");

router.use(protect);

router.route("/").get(getMaintenanceRecords).post(createMaintenance);
router.put("/:id/close", closeMaintenance);
router.delete("/:id", deleteMaintenance);

module.exports = router;
