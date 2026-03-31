const mongoose = require("mongoose");

const QuickTaxiBookingSchema = new mongoose.Schema({
  taxiId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "QuickTaxi",
    required: false,
  },
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  phone: { type: String, required: true },
  country: { type: String, required: true },
  serviceType: { type: String, enum: ["pickup", "drop"], default: "pickup" },
  pickupLocation: { type: String, required: true },
  dropLocation: { type: String, required: true },
  pickupDate: { type: String, required: true },
  dropDate: { type: String },
  pickupTime: { type: String, required: true },
  adults: { type: Number, default: 1 },
  children: { type: Number, default: 0 },
  message: { type: String },
  status: {
    type: String,
    enum: ["Pending", "Confirmed", "Cancelled", "Completed"],
    default: "Pending",
  },
  members: { type: Number },
  createdAt: { type: Date, default: Date.now },
});

QuickTaxiBookingSchema.pre("save", function (next) {
  this.members = (this.adults || 0) + (this.children || 0);
  next();
});

module.exports = mongoose.model("QuickTaxiBooking", QuickTaxiBookingSchema);
