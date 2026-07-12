const mongoose = require("mongoose");

const maintenanceSchema = new mongoose.Schema(
  {
    vehicle: { type: mongoose.Schema.Types.ObjectId, ref: "Vehicle", required: true },
    description: { type: String, required: true, trim: true },
    date: { type: Date, required: true, default: Date.now },
    status: {
      type: String,
      enum: ["Open", "Closed"],
      default: "Open",
    },
    closedAt: { type: Date },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Maintenance", maintenanceSchema);
