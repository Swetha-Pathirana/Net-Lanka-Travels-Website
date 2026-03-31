const mongoose = require("mongoose");

const EventTourBookingSchema = new mongoose.Schema({
  eventId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Event",
    required: true,
  },

  taxiId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "QuickTaxi",
    required: false,
  },

  travelStyle: {
    type: String,
    default: null,
  },

    purpose: {
    type: String,
    default: "",
  },

  name: { type: String, required: true },
  email: { type: String, required: true },
  phone: { type: String, required: true },

  adults: { type: Number, default: 1 },
  children: { type: Number, default: 0 },

  members: { type: Number, default: 1 },

  startDate: { type: Date, required: true },

  startTime: { type: String, required: true },

  message: { type: String },

  status: {
    type: String,
    enum: ["Pending", "Approved", "Cancelled", "Completed"],
    default: "Pending",
  },

  createdAt: { type: Date, default: Date.now },
});

EventTourBookingSchema.pre("save", function (next) {
  this.members = (this.adults || 0) + (this.children || 0);
  next();
});

module.exports = mongoose.model("EventTourBooking", EventTourBookingSchema);
