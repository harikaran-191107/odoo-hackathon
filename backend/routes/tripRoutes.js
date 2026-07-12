const express = require("express");
const router = express.Router();
const {
  getTrips,
  getTrip,
  createTrip,
  completeTrip,
  cancelTrip,
  deleteTrip,
} = require("../controllers/tripController");
const { protect } = require("../middleware/auth");

router.use(protect);

router.route("/").get(getTrips).post(createTrip);
router.route("/:id").get(getTrip).delete(deleteTrip);
router.put("/:id/complete", completeTrip);
router.put("/:id/cancel", cancelTrip);

module.exports = router;
