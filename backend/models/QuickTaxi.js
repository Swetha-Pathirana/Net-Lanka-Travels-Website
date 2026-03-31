const mongoose = require("mongoose");

const QuickTaxiSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    transmission: {
      type: String,
      enum: ["Manual", "Auto"],
      default: "Manual",
    },
    seats: { type: Number, default: 4 },
    luggage: { type: String },
    capacity: { type: String },
    ac: { type: Boolean, default: true },
    image: { type: String, required: true },
  },
  { timestamps: true }
);

module.exports = mongoose.model("QuickTaxi", QuickTaxiSchema);
